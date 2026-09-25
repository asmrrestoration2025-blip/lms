"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const { data: existing } = await supabase.from("wishlists").select("id").eq("user_id", user.id).eq("course_id", courseId).maybeSingle() as unknown as { data: { id:string }|null };
  if (existing) {
    await supabase.from("wishlists").delete().eq("id", existing.id);
  } else {
    await supabase.from("wishlists").insert({ user_id: user.id, course_id: courseId });
  }
  revalidatePath("/courses");
  return { success: true };
}
