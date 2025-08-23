import z from "zod";
import { ProductCategoryEnum } from "./ProductSchema";

export const OrderItemSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  product_id: z.number(),
  product_name: z.string(),
  price_at_purchase: z.number().nonnegative(),
  order_id: z.number(),
  quantity: z.number().min(1),
  product_size: z.enum(["S", "M", "L"]),
});

export const OrderItemWithImageSchema = OrderItemSchema.extend({
  image_url: z.string(),
});

export const OrderItemWithImageAndCategorySchema = OrderItemSchema.extend({
  image_url: z.string(),
  category: ProductCategoryEnum,
});
