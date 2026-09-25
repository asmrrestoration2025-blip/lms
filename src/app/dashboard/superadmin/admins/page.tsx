import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createAdmin, disableAdmin } from "@/server/actions/admin";

export default async function AdminsPage() {
  const service = await createServiceRoleClient().catch(() => null);
  let admins: { user_id:string; roles:{ name:string } | null }[] = [];
  if (service) {
    const { data } = await service.from("user_roles").select("user_id,roles(name)").eq("roles.name","admin") as unknown as { data: typeof admins | null };
    admins = data ?? [];
  }
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Manage Admins</h1>
      <Card>
        <CardHeader><CardTitle>Create admin</CardTitle><CardDescription>Superadmin only — writes audit log</CardDescription></CardHeader>
        <CardContent>
          <form action={createAdmin} className="grid gap-4 sm:grid-cols-3">
            <Input name="fullName" placeholder="Full name" required />
            <Input name="email" type="email" placeholder="admin@example.com" required />
            <Input name="password" type="password" placeholder="Temp password" required />
            <Button type="submit" className="sm:col-span-3">Create admin</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Existing admins ({admins.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {admins.length===0 ? <p className="text-sm text-muted-foreground">No admins yet</p> : admins.map(a=>(
            <div key={a.user_id} className="flex justify-between border-b py-2 text-sm">
              <span>{a.user_id}</span>
              <form action={disableAdmin.bind(null, a.user_id)}><Button variant="outline" size="sm">Disable</Button></form>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
