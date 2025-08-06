import { PostgrestError } from "@supabase/supabase-js";
import { ApiResponse } from "./ApiReponse";
import {
  CustomErrorName,
  DELIVERY_FEE_CONSTANT,
  TAX_FEE_CONSTANT,
} from "./constants";
import { CustomApiError } from "./CustomApiError";
import { OrderItem } from "../database/types/OrderItems";
import { number } from "zod";

export function isNoSessionError(
  response: unknown
): response is ApiResponse<unknown> {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof (response as ApiResponse<unknown>).errorName === "string" &&
    (response as ApiResponse<unknown>).errorName === CustomErrorName.No_Session
  );
}

export function isCustomApiError(error: unknown): error is CustomApiError {
  // return (
  //   error instanceof CustomApiError &&
  //   typeof error === "object" &&
  //   error !== null
  // );

  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "errorName" in error &&
    "message" in error &&
    typeof error.statusCode === "number" &&
    typeof error.errorName === "string" &&
    typeof error.message === "string" &&
    error instanceof CustomApiError
  );
}

export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "details" in error &&
    "hint" in error &&
    "message" in error
  );
}

export function calculateOrderSubtotal(
  orderItems: Pick<
    OrderItem,
    | "price_at_purchase"
    | "product_id"
    | "product_size"
    | "quantity"
    | "product_name"
  >[]
) {
  if (orderItems.length <= 0) return 0;

  return orderItems.reduce(
    (accumulator, currentItem) =>
      accumulator + currentItem.price_at_purchase * currentItem.quantity,
    0
  );
}

export function calculateOrderTotal(
  subtotal: number,
  freeShippingThreshold: number,
  tax: number = TAX_FEE_CONSTANT,
  deliveryFee: number = DELIVERY_FEE_CONSTANT
) {
  if (subtotal === 0) return 0;

  if (subtotal >= freeShippingThreshold) return subtotal + tax;

  return subtotal + deliveryFee + tax;
}
