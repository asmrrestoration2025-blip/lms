"use server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function markLessonComplete(enrollmentId: string, lessonId: string, positionSeconds: number = 0) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const service = await createServiceRoleClient();
  await service.from("lesson_progress").upsert({
    enrollment_id: enrollmentId, lesson_id: lessonId, is_completed: true, last_position_seconds: positionSeconds, completed_at: new Date().toISOString()
  }, { onConflict: "enrollment_id,lesson_id" });
  // Check if course completed → issue certificate
  return { success: "Progress saved" };
}
