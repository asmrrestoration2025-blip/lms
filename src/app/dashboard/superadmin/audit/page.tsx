import { createServiceRoleClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AuditPage() {
  const service = await createServiceRoleClient().catch(()=>null);
  let logs: { id:string; action:string; entity_type:string; created_at:string; actor_id:string|null }[] = [];
  if (service) {
    const { data } = await service.from("audit_logs").select("id,action,entity_type,created_at,actor_id").order("created_at",{ascending:false}).limit(50) as unknown as { data: typeof logs | null };
    logs = data ?? [];
  }
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Audit Logs</h1>
      <Card><CardHeader><CardTitle>Recent privileged actions</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
        {logs.length===0 ? <p className="text-muted-foreground">No logs yet — admin.create, disable, refunds, payouts appear here</p> :
          logs.map(l=><div key={l.id} className="flex justify-between border-b py-1"><span>{l.action} {l.entity_type}</span><span className="text-muted-foreground">{new Date(l.created_at).toLocaleString()}</span></div>)}
      </CardContent></Card>
    </div>
  );
}
