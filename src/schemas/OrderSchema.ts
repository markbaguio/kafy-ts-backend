import z from "zod";
import { OrderItemWithImageSchema } from "./OrderItemSchema";

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

const OrderStatusEnum = z.enum([
  "orderPlaced",
  "orderInProgress",
  "completed",
  "canceled",
]);

export const OrderSchema = z.object({
  id: z.number(),
  total_amount: z.number().nonnegative(),
  status: OrderStatusEnum,
  created_at: z.string(),
  profile_id: z.string(),
});

export const OrdersWithOrderItemsWithImageSchema = OrderSchema.extend({
  order_items: z.array(OrderItemWithImageSchema),
});

export const OrdersWithOrderItemsWithImageSchemaArray = z.array(
  OrdersWithOrderItemsWithImageSchema
);

export type OrdersWithOrderItemsWithImageResponse = z.infer<
  typeof OrdersWithOrderItemsWithImageSchema
>;
