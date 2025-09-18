import z from "zod";
import { addToFavorites } from "../handlers/favoriteHandlers";

export const ProductCategoryEnum = z.enum(["hot", "cold"]);

export const ProductSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  description: z.string(),
  is_available: z.boolean(),
  category: ProductCategoryEnum,
  price: z.number().nonnegative(),
  image_url: z.string(),
});

export const addToFavoritesParametersSchema = ProductSchema.pick({ id: true });

export const removeFavoriteParameterSchema = addToFavoritesParametersSchema;
