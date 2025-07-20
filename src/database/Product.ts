import { Pagination } from "../utils/ApiReponse";
import { Tables } from "./supabase";

export type Products = Tables<"products">;

export type PaginatedMenu = {
  products: Products[];
  pagination: Pagination;
};
