import { createServiceRoleClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminUsersPage() {
  const service = await createServiceRoleClient().catch(()=>null);
  let profiles: { user_id:string; full_name:string|null }[] = [];
  if (service) {
    const { data } = await service.from("profiles").select("user_id,full_name").limit(20) as unknown as { data: typeof profiles | null };
    profiles = data ?? [];
  }
  return (
    <div className="space-y-6"><h1 className="text-xl font-semibold">Users</h1>
      <Card><CardHeader><CardTitle>Recent profiles (RLS: users.read)</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
        {profiles.map(p=><div key={p.user_id} className="border-b py-1">{p.full_name ?? p.user_id}</div>)}
        {profiles.length===0 && <p className="text-muted-foreground">No users or no permission</p>}
      </CardContent></Card>
    </div>
  );
}
