import { ApiResponse } from "./ApiReponse";
import { CustomErrorName } from "./constants";

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
