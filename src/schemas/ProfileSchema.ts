import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.string(),
  created_at: z.string().nullable().nullish(),
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  avatar_url: z.string().nullable().nullish(),
  email: z.string().email().nullish(),
  updated_at: z.string().nullable().nullish(),
});
