import { createServiceRoleClient } from "@/lib/supabase/server";

export async function getPlatformStats() {
  const supabase = await createServiceRoleClient();
  const [courses, enrollments, orders, users] = await Promise.all([
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("enrollments").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total_cents").eq("status","paid"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);
  const revenue = (orders.data as unknown as { total_cents:number }[] | null)?.reduce((s, o) => s + o.total_cents, 0) ?? 0;
  return {
    totalCourses: (courses as unknown as { count:number | null }).count ?? 0,
    totalEnrollments: (enrollments as unknown as { count:number | null }).count ?? 0,
    totalUsers: (users as unknown as { count:number | null }).count ?? 0,
    totalRevenueCents: revenue,
  };
}
