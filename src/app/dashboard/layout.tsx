import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "@/server/actions/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: roles } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);
  const roleNames = (roles as unknown as { roles: { name: string } | null }[] | null)?.map(r => r.roles?.name).filter(Boolean) ?? [];
  const primary = roleNames.includes("superadmin") ? "superadmin" : roleNames.includes("admin") ? "admin" : roleNames.includes("instructor") ? "instructor" : "student";

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="font-semibold">Lumen — {primary}</Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <form action={signOut}><Button variant="outline" size="sm">Sign out</Button></form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-4 px-6 py-2 text-sm">
          <Link href="/dashboard/student" className="hover:underline">Student</Link>
          <Link href="/dashboard/instructor" className="hover:underline">Instructor</Link>
          <Link href="/dashboard/admin" className="hover:underline">Admin</Link>
          <Link href="/dashboard/superadmin" className="hover:underline">Superadmin</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
