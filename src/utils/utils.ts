import { ApiResponse } from "./ApiReponse";
import { CustomErrorName } from "./constants";
import { CustomApiError } from "./CustomApiError";

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
