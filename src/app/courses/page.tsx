import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/course-card";
import { EmptyState } from "@/components/empty-state";

export default async function MarketplacePage({ searchParams }: { searchParams?: { q?: string } }) {
  const supabase = await createClient();
  let query = supabase.from("courses").select("slug,title,level,price_cents").eq("status","published").limit(24);
  if (searchParams?.q) query = query.ilike("title", `%${searchParams.q}%`);
  const { data } = await query;
  const courses = (data as unknown as { slug:string; title:string; level:string; price_cents:number }[] | null) ?? [];
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Marketplace</h1>
      <form className="flex gap-2"><input name="q" placeholder="Search courses" defaultValue={searchParams?.q} className="flex h-9 w-full rounded-md border px-3 text-sm" /><button type="submit" className="rounded-md bg-primary px-4 text-sm text-primary-foreground">Search</button></form>
      {courses.length===0 ? <EmptyState title="No courses yet" description="Publish a course to see it here" /> : <div className="grid gap-6 sm:grid-cols-3">{courses.map(c=><CourseCard key={c.slug} course={c} />)}</div>}
    </div>
  );
}
