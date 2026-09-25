import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(5).max(120),
  slug: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/),
  description: z.string().min(20).max(5000).optional(),
  category_id: z.string().uuid().optional().nullable(),
  level: z.enum(["beginner","intermediate","advanced","all"]),
  language: z.string().min(2).max(10).default("en"),
  price_cents: z.number().int().min(0).max(1000000),
  currency: z.string().min(3).max(3).default("USD"),
});

export const sectionSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(3).max(100),
  position: z.number().int().min(0),
});

export const lessonSchema = z.object({
  section_id: z.string().uuid(),
  title: z.string().min(3).max(100),
  kind: z.enum(["video","article","quiz","resource"]).default("video"),
  is_preview: z.boolean().default(false),
});
