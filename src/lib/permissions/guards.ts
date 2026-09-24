import { createClient } from "@/lib/supabase/server";
import { ROLES, type Role } from "./constants";

export type AuthContext = {
  userId: string;
  email: string | null;
  roles: Role[];
};

export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userRoles } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", user.id);

  const roles: Role[] =
    (userRoles as unknown as { roles: { name: string } | null }[] | null)
      ?.map((r) => r.roles?.name as Role)
      .filter(Boolean) ?? [];

  return {
    userId: user.id,
    email: user.email ?? null,
    roles,
  };
}

export function hasRole(ctx: AuthContext | null, role: Role): boolean {
  if (!ctx) return false;
  return ctx.roles.includes(role);
}

export function isSuperAdmin(ctx: AuthContext | null): boolean {
  return hasRole(ctx, ROLES.SUPERADMIN);
}

export function isAdmin(ctx: AuthContext | null): boolean {
  return hasRole(ctx, ROLES.ADMIN) || isSuperAdmin(ctx);
}

export async function requireAuth(): Promise<AuthContext> {
  const ctx = await getAuthContext();
  if (!ctx) throw new Error("Unauthorized");
  return ctx;
}

export async function requireRole(role: Role): Promise<AuthContext> {
  const ctx = await requireAuth();
  if (!ctx.roles.includes(role) && !isSuperAdmin(ctx)) {
    throw new Error(`Forbidden: requires role ${role}`);
  }
  return ctx;
}

export async function requireSuperAdmin(): Promise<AuthContext> {
  return requireRole(ROLES.SUPERADMIN);
}
