"use server";
import { z } from "zod";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logging/logger";

const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  fullName: z.string().min(2).max(80),
});

async function requireSuperadmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: roles } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id) as unknown as { data: { roles:{ name:string } | null }[] | null };
  const names = (roles ?? []).map(r => r.roles?.name);
  if (!names.includes("superadmin")) throw new Error("Forbidden: superadmin required");
  return user;
}

export async function createAdmin(formData: FormData) {
  const raw = { email: formData.get("email"), password: formData.get("password"), fullName: formData.get("fullName") };
  const parsed = createAdminSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  let actor;
  try { actor = await requireSuperadmin(); } catch (e) { return { error: (e as Error).message }; }

  const service = await createServiceRoleClient();
  const { data: created, error } = await service.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.fullName },
  });
  if (error || !created.user) return { error: error?.message ?? "Failed to create user" };

  const { data: adminRole } = await service.from("roles").select("id").eq("name","admin").single() as unknown as { data: { id:string } | null };
  if (adminRole) await service.from("user_roles").insert({ user_id: created.user.id, role_id: adminRole.id, granted_by: actor.id });
  await service.from("audit_logs").insert({ actor_id: actor.id, action: "admin.create", entity_type: "user", entity_id: created.user.id, metadata: { email: parsed.data.email } });
  logger.info({ message: "admin created", data: { email: parsed.data.email, actor: actor.id } });
  return { success: `Admin ${parsed.data.email} created` };
}

export async function disableAdmin(userId: string) {
  try { await requireSuperadmin(); } catch (e) { return { error: (e as Error).message }; }
  const service = await createServiceRoleClient();
  await service.auth.admin.updateUserById(userId, { ban_duration: "876000h" });
  const actor = (await createClient()).auth.getUser();
  return { success: "Admin disabled" };
}
