import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = user ? await supabase.from("notifications").select("id,title,body,is_read,created_at").eq("user_id", user.id).order("created_at",{ascending:false}).limit(20) as unknown as { data: { id:string; title:string; body:string|null; is_read:boolean; created_at:string }[] | null } : { data: null };
  const items = data ?? [];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Notifications</h1>
      {items.length===0 ? <EmptyState title="No notifications" description="Enrollment, payment, and system updates appear here (Realtime enabled)" /> :
        <div className="space-y-3">{items.map(n=>(
          <Card key={n.id} className={n.is_read ? "opacity-60" : ""}><CardHeader><CardTitle className="text-base">{n.title}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{n.body}</p></CardContent></Card>
        ))}</div>
      }
    </div>
  );
}
