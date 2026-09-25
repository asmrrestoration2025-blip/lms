import { createServiceRoleClient } from "@/lib/supabase/server";

export async function issueCertificate(userId: string, courseId: string, enrollmentId: string) {
  const supabase = await createServiceRoleClient();
  const certNumber = `LUMEN-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  const { data, error } = await supabase.from("certificates").insert({
    certificate_number: certNumber,
    user_id: userId,
    course_id: courseId,
    enrollment_id: enrollmentId,
  }).select().single();
  if (error) throw error;
  return data;
}
