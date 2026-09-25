import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("id,title,status,instructor_id").eq("status","pending_review").limit(20) as unknown as { data: { id:string; title:string; status:string; instructor_id:string }[]|null };
  const courses = data ?? [];
  return (
    <div className="space-y-6"><h1 className="text-xl font-semibold">Course Moderation</h1>
      {courses.map(c=>(
        <Card key={c.id}><CardHeader><CardTitle className="text-base">{c.title}</CardTitle></CardHeader><CardContent className="flex gap-2"><Button size="sm" className="bg-[#0F2040]">Approve</Button><Button size="sm" variant="outline">Reject</Button></CardContent></Card>
      ))}
      {courses.length===0 && <Card><CardContent className="pt-6 text-sm text-muted-foreground">No pending courses</CardContent></Card>}
    </div>
  );
}
