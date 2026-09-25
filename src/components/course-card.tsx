import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CourseCard({ course }: { course: { slug: string; title: string; level: string; price_cents: number } }) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader><CardTitle className="text-base line-clamp-2">{course.title}</CardTitle></CardHeader>
        <CardContent className="flex justify-between text-sm"><Badge variant="secondary">{course.level}</Badge><span>{course.price_cents===0 ? "Free" : `$${(course.price_cents/100).toFixed(2)}`}</span></CardContent>
      </Card>
    </Link>
  );
}
