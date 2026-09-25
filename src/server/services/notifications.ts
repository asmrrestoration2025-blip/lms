import { createServiceRoleClient } from "@/lib/supabase/server";

export async function notify(userId: string, title: string, body?: string, kind: string = "general", data?: unknown) {
  const supabase = await createServiceRoleClient();
  await supabase.from("notifications").insert({ user_id: userId, title, body, kind, data });
}

// Realtime: client subscribes via supabase.channel(`notifications:${userId}`).on('postgres_changes', { event:'INSERT', schema:'public', table:'notifications', filter:`user_id=eq.${userId}` })
