import { Pagination } from "../utils/ApiReponse";
import { Tables } from "./supabase";

export type Products = Tables<"products">;

export type PaginatedProducts = {
  products: Products[];
  pagination: Pagination;
};
