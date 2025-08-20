import z from "zod";

const ProductCategoryEnum = z.enum(["hot", "cold"]);

const ProductSchema = z.object({
  id: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  name: z.string(),
  description: z.string(),
  is_available: z.boolean(),
  category: ProductCategoryEnum,
  price: z.number().nonnegative(),
  image_url: z.string(),
});
