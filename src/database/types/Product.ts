import { CustomPagination } from "../../utils/ApiReponse";
import { Tables } from "../supabase";

export type Product = Tables<"products">;

export type PaginatedProducts = {
  products: Product[];
  pagination: CustomPagination;
};
