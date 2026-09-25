import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCourse } from "@/server/actions/courses";

export default async function InstructorCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = user ? await supabase.from("courses").select("id,title,slug,status,price_cents").eq("instructor_id", user.id).order("created_at",{ascending:false}).limit(20) as unknown as { data: { id:string; title:string; slug:string; status:string; price_cents:number }[]|null } : { data: null };
  const courses = data ?? [];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Courses</h1>
      <Card><CardHeader><CardTitle>Create course</CardTitle></CardHeader><CardContent>
        <form action={createCourse} className="grid gap-3 sm:grid-cols-2">
          <Input name="title" placeholder="Title" required />
          <Input name="slug" placeholder="slug-like-this" required pattern="^[a-z0-9-]+$" />
          <Input name="price_cents" placeholder="Price cents (0=free)" type="number" defaultValue="0" />
          <select name="level" defaultValue="beginner" className="h-9 rounded-md border px-3 text-sm"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="all">All</option></select>
          <Input name="description" placeholder="Description" className="sm:col-span-2" />
          <Button type="submit" className="sm:col-span-2 bg-[#0F2040]">Create</Button>
        </form>
      </CardContent></Card>
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map(c=>(
          <Card key={c.id}><CardHeader><CardTitle className="text-base">{c.title}</CardTitle></CardHeader><CardContent className="flex justify-between text-sm"><span>{c.slug} • {c.status}</span><span>{c.price_cents===0?"Free":`$${(c.price_cents/100).toFixed(2)}`}</span></CardContent></Card>
        ))}
      </div>
    </div>
  );
}
