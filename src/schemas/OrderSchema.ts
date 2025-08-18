import z from "zod";

export const PlaceOrderPayloadSchema = z.object({
  order_items: z.array(
    z.object({
      product_id: z.number(),
      product_name: z.string(),
      price_at_purchase: z.number(),
      quantity: z.number().min(1),
      product_size: z.enum(["S", "M", "L"]),
    })
  ),
});
