import { z } from "zod";

export const checkoutSchema = z.object({
  courseId: z.string().uuid(),
  couponCode: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(3).max(20),
  discount_type: z.enum(["percent","fixed"]),
  discount_value: z.number().int().min(0),
});

export const refundRequestSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().min(5).max(500),
});
