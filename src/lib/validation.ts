import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().max(100, "Name too long").optional(),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  category: z.enum(["general", "feedback", "bug", "collab"]),
  message: z.string().trim().min(5, "Message too short").max(2000, "Message too long"),
});

export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export const fieldNoteSchema = z.object({
  title: z.string().trim().min(1, "Title required").max(200, "Title too long"),
  notes: z.string().trim().max(5000, "Notes too long").optional(),
  category: z.string().trim().max(80).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  photo_data_url: z.string()
    .max(6_000_000, "Image too large (max ~4 MB)")
    .refine((v) => !v || v.startsWith("data:image/"), "Invalid image")
    .optional(),
  observed_at: z.string().datetime().optional(),
});

export const profileSchema = z.object({
  display_name: z.string().trim().min(1, "Name required").max(80, "Name too long").optional(),
  avatar_url: z.string()
    .max(2_000_000, "Image too large (max ~1.5 MB)")
    .refine((v) => !v || v.startsWith("data:image/") || v.startsWith("https://"), "Invalid image")
    .optional(),
});

export const authSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(128),
});


export type FieldNoteInput = z.infer<typeof fieldNoteSchema>;
