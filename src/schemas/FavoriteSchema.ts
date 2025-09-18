import z from "zod";

export const FavoriteSchema = z.object({
  id: z.number().nonnegative(),
  user_id: z.string(),
  product_id: z.number().nonnegative(),
  created_at: z.string(),
});

export const AddToFavoriteSchema = FavoriteSchema.pick({
  user_id: true,
  product_id: true,
});

export type AddToFavorite = z.infer<typeof AddToFavoriteSchema>;

export type AddToFavotireResponse = AddToFavorite;

export type RemoveFavoritePathParam = Pick<AddToFavorite, "product_id">;

export type RemoveFavoriteResponse = z.infer<typeof FavoriteSchema>;
