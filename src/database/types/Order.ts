import { Tables } from "../supabase";
import { OrderItem } from "./OrderItems";
import { Product } from "./Product";

export type Order = Tables<"orders">;

export type OrderItemsWithImage = OrderItem & Pick<Product, "image_url">;
export type OrderItemsWithImageAndCategory = OrderItem &
  Pick<Product, "image_url" | "category">;

export type OrderWithOrderItemsWithImage = Order & {
  order_items: OrderItemsWithImage[];
};

export type OrderWithOrderItemsWithImageAndCategory = Order & {
  order_items: OrderItemsWithImageAndCategory[];
};

export type RawOrdersWithOrderItemsWithImage = Order & {
  order_items: (OrderItem & {
    products: Pick<Product, "image_url"> | null;
  })[];
};
