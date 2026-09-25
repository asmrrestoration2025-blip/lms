"use server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getProvider } from "@/server/services/payments";
import { checkoutSchema } from "@/lib/validation/payments";

export async function createCheckout(formData: FormData) {
  const raw = { courseId: formData.get("courseId") as string, couponCode: formData.get("couponCode") as string | undefined };
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid input" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: course } = await supabase.from("courses").select("id,price_cents,currency").eq("id", parsed.data.courseId).single() as unknown as { data: { id:string; price_cents:number; currency:string } | null };
  if (!course) return { error: "Course not found" };

  // Create order + item via service role (bypass RLS for atomic creation) — price is server-trusted, never client price
  const service = await createServiceRoleClient();
  const { data: order, error: orderErr } = await service.from("orders").insert({
    user_id: user.id, status: "pending", subtotal_cents: course.price_cents, total_cents: course.price_cents, currency: course.currency,
  }).select().single() as unknown as { data: { id:string } | null; error: unknown };
  if (orderErr || !order) return { error: "Failed to create order" };

  await service.from("order_items").insert({ order_id: order.id, course_id: course.id, unit_price_cents: course.price_cents });
  const provider = getProvider();
  const result = await provider.createCheckout({ orderId: order.id, amountCents: course.price_cents, currency: course.currency, userId: user.id, courseId: course.id });
  await service.from("payments").insert({ order_id: order.id, provider: result.provider, provider_payment_id: result.providerPaymentId, status: "pending", amount_cents: course.price_cents, currency: course.currency });

  // For free courses, immediately enroll
  if (course.price_cents === 0) {
    await service.from("enrollments").insert({ user_id: user.id, course_id: course.id, status: "active" });
    await service.from("orders").update({ status: "paid" }).eq("id", order.id);
    return { success: "Enrolled", orderId: order.id };
  }
  return { success: "Checkout created", orderId: order.id, checkoutUrl: result.checkoutUrl };
}
