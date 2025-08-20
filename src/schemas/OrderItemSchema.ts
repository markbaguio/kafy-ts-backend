import z from "zod";

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
