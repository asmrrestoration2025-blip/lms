import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";

export default async function LearnPage({ params }: { params: { courseId: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  // RLS ensures only enrolled users can fetch progress; UI shows empty state until enrollment logic (Phase 5) is wired
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Learn — {params.courseId}</h1>
      <Card><CardHeader><CardTitle>Course player</CardTitle></CardHeader><CardContent><EmptyState title="Enroll to start" description="Complete checkout to access lessons, progress, and certificates" /></CardContent></Card>
    </div>
  );
}
