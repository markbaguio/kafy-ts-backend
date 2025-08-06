export const AUTHROUTE = "/auth";
export const BASE_ROUTE = "/api";

export const ITEMS_PER_PAGE = 10;

export const FREE_SHIPPING_THRESHOLD = 450;

export enum CustomErrorName {
  No_Session = "No_Session",
  Profile_Not_Found = "Profile_Not_Found",
  PostgrestError = "PostgrestError",
}

export enum CustomErrorMessage {
  Profile_Not_Found_Message = "Profile not found",
}
