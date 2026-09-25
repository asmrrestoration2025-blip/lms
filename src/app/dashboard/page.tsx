import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: roles } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);
  const names = (roles as unknown as { roles: { name: string } | null }[] | null)?.map(r => r.roles?.name) ?? [];
  if (names.includes("superadmin")) redirect("/dashboard/superadmin");
  if (names.includes("admin")) redirect("/dashboard/admin");
  if (names.includes("instructor")) redirect("/dashboard/instructor");
  redirect("/dashboard/student");
}
