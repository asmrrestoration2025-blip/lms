import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function CourseDetail({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("id,slug,title,description,level,price_cents,status").eq("slug", params.slug).single();
  const course = data as unknown as { id:string; slug:string; title:string; description:string|null; level:string; price_cents:number; status:string } | null;
  if (!course) return notFound();
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <Badge>{course.level}</Badge>
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <Card><CardHeader><CardTitle>About this course</CardTitle><CardDescription>{course.description ?? "No description"}</CardDescription></CardHeader><CardContent><Button>Enroll — {course.price_cents===0 ? "Free" : `$${(course.price_cents/100).toFixed(2)}`}</Button></CardContent></Card>
    </div>
  );
}
