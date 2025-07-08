import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "First name is required"),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(25, "Password must not exceed 25 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter."),
});

export const ProfileSchema = z.object({
  id: z.string(),
  created_at: z.string().nullable().nullish(),
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  avatar_url: z.string().nullable().nullish(),
  email: z.string().email().nullish(),
  updated_at: z.string().nullable().nullish(),
});

export const MenuQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
});

export type MenuQueryParams = z.infer<typeof MenuQueryParamsSchema>;
