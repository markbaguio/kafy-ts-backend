import { z } from "zod";

export const MenuQueryParamsSchema = z.object({
  page: z.coerce.string().min(1).default("1"),
  category: z.enum(["hot", "cold"]).default("hot"),
});

export const ProductDetailSchema = z.object({
  product_id: z.string(),
});

export type MenuQueryParams = z.infer<typeof MenuQueryParamsSchema>;
export type ProductDetailRequestParam = z.infer<typeof ProductDetailSchema>;
