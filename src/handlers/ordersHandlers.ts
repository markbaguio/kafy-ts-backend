import { NextFunction, Request, Response } from "express-serve-static-core";
import {
  GetOrdersQueryParametersSchema,
  GetOrdersRequestQueryParameters,
  OrdersWithOrderItemsWithImageAndCategoryResponse,
  OrdersWithOrderItemsWithImageAndCategorySchemaArray,
  OrdersWithOrderItemsWithImageResponse,
  OrdersWithOrderItemsWithImageSchemaArray,
  PlaceOrderPayloadSchema,
} from "../schemas/OrderSchema";
import { calculateOrderSubtotal, calculateOrderTotal } from "../utils/utils";
import {
  DELIVERY_FEE_CONSTANT,
  FREE_SHIPPING_THRESHOLD,
  TAX_FEE_CONSTANT,
} from "../utils/constants";
import {
  Order,
  OrderItemsWithImage,
  OrderItemsWithImageAndCategory,
  OrderWithOrderItemsWithImage,
  OrderWithOrderItemsWithImageAndCategory,
  RawOrdersWithOrderItemsWithImage,
} from "../database/types/Order";
import { OrderItem } from "../database/types/OrderItems";
import supabaseClient from "../utils/supabaseClient";
import { ApiResponse } from "../utils/ApiReponse";
import { QueryData } from "@supabase/supabase-js";

//! TECHNICAL DEBT: Use supabase RPC(PostgresSQL function) to implement some kind of TRANSACTIONAL SAFETY. RPC ensures that partial failures which leads to data inconsistency won't happen.
//! TEMPORARY FIX: query the orphaned data (order without order_items or order_items without order) then delete them. This is not a fix and should be implemented before scaling further.

/**
 * ? Handle the free shipping here on the backend.
 * ? postOrder is a protected route. This must check if the access token is still valid before proceeding with the process.
 */
export async function postOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    //? use access token from httpOnly cookie to check if the access token of the user is already expired.
    const accessToken = request.cookies["access_token"];
    const { data: tData, error: tError } = await supabaseClient.auth.getUser(
      accessToken
    );

    if (tError) {
      next(tError);
      return;
    }

    const parsedPlaceOrderPayload = PlaceOrderPayloadSchema.safeParse(
      request.body
    );
    if (!parsedPlaceOrderPayload.success) {
      next(parsedPlaceOrderPayload.error);
      return;
    }

    //? calculate for subtotal.
    const subtotal = calculateOrderSubtotal(
      parsedPlaceOrderPayload.data.order_items
    );

    //? calculate order total.
    const orderTotal = calculateOrderTotal(
      subtotal,
      FREE_SHIPPING_THRESHOLD,
      TAX_FEE_CONSTANT,
      DELIVERY_FEE_CONSTANT
    );

    //? get the profileID/userID using access token sent from the frontend.
    //? create newOrderRecord.
    const newOrder: Omit<Order, "id" | "created_at"> = {
      // profile_id: "fce5023b-4a71-41fb-b2c0-ced50f9e0e6f", //? mock for testing.
      profile_id: tData.user.id,
      status: "orderPlaced",
      total_amount: orderTotal,
    };

    //? insert newOrder into the database.
    const {
      data: newOrderRecord,
      error: newOrderRecordError,
      count: ordersCount,
      status: orderStatus,
      statusText,
    } = await supabaseClient
      .from("orders")
      .insert(newOrder, { count: "exact" })
      .select()
      .single();

    if (newOrderRecordError) {
      next(newOrderRecordError);
      return;
    }

    //? create newOrderItems array
    const newOrderItems: Omit<OrderItem, "id" | "created_at">[] =
      parsedPlaceOrderPayload.data.order_items.map((orderItem) => ({
        order_id: newOrderRecord.id,
        price_at_purchase: orderItem.price_at_purchase,
        product_id: orderItem.product_id,
        product_name: orderItem.product_name,
        product_size: orderItem.product_size,
        quantity: orderItem.quantity,
      }));

    const {
      data: newOrderItemsRecord,
      error: newOrderItemsRecordError,
      count: orderItemsCount,
      status: orderItemsStatus,
    } = await supabaseClient
      .from("order_items")
      .insert(newOrderItems, { count: "exact" })
      .select();

    if (newOrderItemsRecordError) {
      next(newOrderItemsRecordError);
      return;
    }

    const res: ApiResponse<Pick<Order, "id">> = {
      statusCode: 200,
      message: "Order has been placed successfully",
      data: {
        id: newOrderRecord.id,
      },
    };

    response.json(res);
  } catch (error) {
    next(error);
  }
}

export async function getOrders(
  request: Request<{}, {}, {}, GetOrdersRequestQueryParameters>,
  response: Response<ApiResponse<OrdersWithOrderItemsWithImageResponse[]>>,
  next: NextFunction
) {
  try {
    const parsedGetOrdersQueryParams = GetOrdersQueryParametersSchema.safeParse(
      request.query
    );

    if (!parsedGetOrdersQueryParams.success) {
      next(parsedGetOrdersQueryParams.error);
      return;
    }

    const accessToken: string = request.cookies["access_token"];

    const orderStatus = parsedGetOrdersQueryParams.data?.status;

    const { data: userData, error: userDataError } =
      await supabaseClient.auth.getUser(accessToken);

    if (userDataError) {
      next(userDataError);
      return;
    }

    //? The resulting data of this query has the type of RawOrdersWithOrderItemsWithImage, which is used to type the parameter of mapOrdersWithOrderItemsWithImage.
    //? This query will return the orders of the user with the order items and the image URL of the product.
    let ordersWithOrderItemsQuery = supabaseClient
      .from("orders")
      .select(
        `
        id,
        total_amount,
        profile_id,
        status,
        created_at,
        order_items (
          id,
          order_id,
          product_id,
          product_name,
          price_at_purchase,
          quantity,
          product_size,
          created_at,
          products (
            id,
            image_url,
            category
          )
        )
        `
      )
      .eq("profile_id", userData.user.id)
      // .eq("status", orderStatus)
      .order("created_at", { ascending: false });

    //? You can get the type of the data returned by the query using QueryData utility type from supabase-js. However, this can only be used within this block as it needs the query to infer the type.
    // type OrderWithOrderItems = QueryData<typeof ordersWithOrderItemsQuery>;

    //? if status is "" query all orders.
    if (orderStatus !== "") {
      ordersWithOrderItemsQuery = ordersWithOrderItemsQuery.eq(
        "status",
        orderStatus
      );
    }

    const { data, error, status } = await ordersWithOrderItemsQuery;

    if (error) {
      next(error);
      return;
    }

    const flattenOrdersWithOrderItems: OrderWithOrderItemsWithImageAndCategory[] =
      data.map((order) => ({
        ...order,
        order_items: order.order_items.map(
          ({ products, ...rest }): OrderItemsWithImageAndCategory => ({
            ...rest,
            image_url: products.image_url,
            category: products.category,
            // image_url: products?.image_url ?? null,
            // category: products.category,
          })
        ),
      }));

    // const parsedOrdersWithOrderItemsWithImage =
    //   OrdersWithOrderItemsWithImageSchemaArray.safeParse(
    //     flattenOrdersWithOrderItems
    //   );

    // if (!parsedOrdersWithOrderItemsWithImage.success) {
    //   next(parsedOrdersWithOrderItemsWithImage.error);
    //   return;
    // }

    const parsedOrdersWithOrderItemsWithImageAndCategory =
      OrdersWithOrderItemsWithImageAndCategorySchemaArray.safeParse(
        flattenOrdersWithOrderItems
      );

    if (!parsedOrdersWithOrderItemsWithImageAndCategory.success) {
      next(parsedOrdersWithOrderItemsWithImageAndCategory.error);
      return;
    }
    // const flattenOrdersWithOrderItems = mapOrdersWithOrderItemsWithImage(data);

    // const res: ApiResponse<RawOrdersWithOrderItemsWithImage[]> = {
    //   statusCode:
    // }
    // const res: ApiResponse<OrdersWithOrderItemsWithImageResponse[]> = {
    //   statusCode: status,
    //   data: parsedOrdersWithOrderItemsWithImage.data,
    // };

    const res: ApiResponse<OrdersWithOrderItemsWithImageAndCategoryResponse[]> =
      {
        statusCode: status,
        data: parsedOrdersWithOrderItemsWithImageAndCategory.data,
      };

    response.json(res);
  } catch (error) {
    next(error);
    return;
  }
}
