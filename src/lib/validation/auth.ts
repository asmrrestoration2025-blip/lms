import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name is too short").max(80),
  email: z.string().email(),
  password: z.string().min(8, "At least 8 characters").max(72),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8).max(72),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
