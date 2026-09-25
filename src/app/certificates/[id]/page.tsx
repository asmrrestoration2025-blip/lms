import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CertificatePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data } = await supabase.from("certificates").select("certificate_number,issued_at,courses(title)").eq("id", params.id).single() as unknown as { data: { certificate_number:string; issued_at:string; courses:{ title:string } | null } | null };
  if (!data) return notFound();
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Card className="border-2">
        <CardHeader><CardTitle>Certificate of Completion</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-lg font-semibold">{data.courses?.title ?? "Course"}</p>
          <p className="text-sm text-muted-foreground">Certificate: {data.certificate_number}</p>
          <p className="text-sm text-muted-foreground">Issued: {new Date(data.issued_at).toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
