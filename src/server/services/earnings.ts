import { createServiceRoleClient } from "@/lib/supabase/server";

// Called from webhook after order paid — splits 70/30 (configurable) and records earnings
export async function recordEarnings(orderId: string) {
  const supabase = await createServiceRoleClient();
  const { data: items } = await supabase.from("order_items").select("id,course_id,unit_price_cents,courses(instructor_id)").eq("order_id", orderId) as unknown as { data: { id:string; course_id:string; unit_price_cents:number; courses:{ instructor_id:string } | null }[] | null };
  for (const it of items ?? []) {
    const instructorId = it.courses?.instructor_id;
    if (!instructorId) continue;
    const gross = it.unit_price_cents;
    const fee = Math.round(gross * 0.3);
    await supabase.from("instructor_earnings").insert({
      instructor_id: instructorId,
      order_item_id: it.id,
      gross_cents: gross,
      platform_fee_cents: fee,
      net_cents: gross - fee,
      status: "available",
    });
  }
}

export async function requestPayout(instructorId: string, amountCents: number) {
  const supabase = await createServiceRoleClient();
  const { data: earnings } = await supabase.from("instructor_earnings").select("net_cents").eq("instructor_id", instructorId).eq("status","available") as unknown as { data: { net_cents:number }[] | null };
  const available = (earnings ?? []).reduce((s, e) => s + e.net_cents, 0);
  if (amountCents > available) throw new Error("Insufficient available earnings");
  const { data, error } = await supabase.from("payouts").insert({ instructor_id: instructorId, amount_cents: amountCents, status: "pending" }).select().single();
  if (error) throw error;
  return data;
}
