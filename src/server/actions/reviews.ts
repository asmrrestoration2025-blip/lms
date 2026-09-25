"use server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimitOrThrow } from "@/lib/security/rate-limit";

const schema = z.object({ course_id: z.string().uuid(), rating: z.number().min(1).max(5), body: z.string().min(10).max(2000).optional() });

export async function submitReview(formData: FormData) {
  const raw = { course_id: formData.get("course_id") as string, rating: Number(formData.get("rating")), body: formData.get("body") as string };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  try { rateLimitOrThrow(`review:${user.id}`, 3, 60_000); } catch(e){ return { error: (e as Error).message }; }
  const { error } = await supabase.from("reviews").upsert({ user_id: user.id, course_id: parsed.data.course_id, rating: parsed.data.rating, body: parsed.data.body }, { onConflict: "user_id,course_id" });
  if (error) return { error: error.message };
  return { success: "Review saved" };
}
