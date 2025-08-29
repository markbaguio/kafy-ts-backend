import z from "zod";
import {
  OrderItemWithImageAndCategorySchema,
  OrderItemWithImageSchema,
} from "./OrderItemSchema";

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

export const OrdersWithOrderItemsWithImageAndCategorySchema =
  OrderSchema.extend({
    order_items: z.array(OrderItemWithImageAndCategorySchema),
  });

export const OrdersWithOrderItemsWithImageAndCategorySchemaArray = z.array(
  OrdersWithOrderItemsWithImageAndCategorySchema
);

export type OrderWithOrderItemsWithImageAndCategoryResponse = z.infer<
  typeof OrdersWithOrderItemsWithImageAndCategorySchema
>;

export const GetOrdersQueryParametersSchema = z.object({
  status: OrderStatusEnum,
});

export type GetOrdersRequestQueryParameters = z.infer<
  typeof GetOrdersQueryParametersSchema
>;

export const GetLatestOrdersQueryParametersSchema = z.object({
  limit: z.coerce.number().positive().min(1).default(1),
});

export type GetLatestOrdersQueryParameters = z.infer<
  typeof GetLatestOrdersQueryParametersSchema
>;
