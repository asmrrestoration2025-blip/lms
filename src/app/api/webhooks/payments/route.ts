import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getProvider } from "@/server/services/payments";

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-webhook-signature") ?? "";
  let evt;
  try {
    const provider = getProvider();
    evt = await provider.verifyWebhook(JSON.parse(raw || "{}"), sig);
  } catch (e) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  // Idempotent: check if payment already succeeded
  const supabase = await createServiceRoleClient();
  if (evt.type === "payment.succeeded" && evt.orderId) {
    const { data: payment } = await supabase.from("payments").select("id,status").eq("provider_payment_id", evt.providerPaymentId).single() as unknown as { data: { id:string; status:string } | null };
    if (payment?.status === "succeeded") return NextResponse.json({ received: true, duplicate: true });

    await supabase.from("payments").update({ status: "succeeded" }).eq("provider_payment_id", evt.providerPaymentId);
    await supabase.from("orders").update({ status: "paid" }).eq("id", evt.orderId);
    // Enroll — idempotent via unique constraint
    const { data: order } = await supabase.from("orders").select("user_id").eq("id", evt.orderId).single() as unknown as { data: { user_id:string } | null };
    const { data: items } = await supabase.from("order_items").select("course_id").eq("order_id", evt.orderId) as unknown as { data: { course_id:string }[] | null };
    for (const it of items ?? []) {
      await supabase.from("enrollments").upsert({ user_id: order!.user_id, course_id: it.course_id, status: "active" }, { onConflict: "user_id,course_id" });
    }
  }
  return NextResponse.json({ received: true });
}
