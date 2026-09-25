"use server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { courseSchema } from "@/lib/validation/course";
import { revalidatePath } from "next/cache";

async function requireInstructor() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: roles } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id) as unknown as { data: { roles:{ name:string }|null }[]|null };
  const names = (roles??[]).map(r=>r.roles?.name);
  if (!names.includes("instructor") && !names.includes("admin") && !names.includes("superadmin")) throw new Error("Instructor required");
  return user;
}

export async function createCourse(formData: FormData) {
  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    level: formData.get("level") as string,
    price_cents: Number(formData.get("price_cents")),
    currency: (formData.get("currency") as string) || "USD",
    language: (formData.get("language") as string) || "en",
  };
  const parsed = courseSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  let user;
  try { user = await requireInstructor(); } catch(e){ return { error: (e as Error).message }; }
  const service = await createServiceRoleClient();
  const { error } = await service.from("courses").insert({ ...parsed.data, instructor_id: user.id, status: "draft" });
  if (error) return { error: error.message };
  revalidatePath("/dashboard/instructor/courses");
  return { success: "Course created" };
}

export async function publishCourse(courseId: string) {
  let user; try { user = await requireInstructor(); } catch(e){ return { error: (e as Error).message }; }
  const service = await createServiceRoleClient();
  await service.from("courses").update({ status: "pending_review" }).eq("id", courseId).eq("instructor_id", user.id);
  await service.from("audit_logs").insert({ actor_id: user.id, action: "course.submit", entity_type: "course", entity_id: courseId });
  return { success: "Submitted for review" };
}
