import { z } from "zod";

export const MenuQueryParamsSchema = z.object({
  page: z.coerce.string().min(1).default("1"),
  category: z.enum(["hot", "cold"]).default("hot"),
});

export type MenuQueryParams = z.infer<typeof MenuQueryParamsSchema>;
