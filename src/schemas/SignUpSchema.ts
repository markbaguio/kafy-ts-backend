import { z } from "zod";

export const SignUpSchema = z.object({
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
