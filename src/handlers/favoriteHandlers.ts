import { NextFunction, Request, Response } from "express-serve-static-core";
import { AddToFavoritesRequestBody } from "../database/types/Profile";
import supabaseClient from "../utils/supabaseClient";
import { ApiResponse } from "../utils/ApiReponse";
import { addToFavoritesParametersSchema } from "../schemas/ProductSchema";
import {
  AddToFavorite,
  AddToFavoriteSchema,
  FavoriteSchema,
} from "../schemas/FavoriteSchema";

export async function addToFavorites(
  request: Request<{}, any, AddToFavoritesRequestBody, {}>, //? the fourth one is the query params
  response: Response<ApiResponse<AddToFavorite>>,
  next: NextFunction
) {
  try {
    const accessToken = request.cookies["access_token"];

    //? check is the access token is still valid.
    //? if not this will return an error 401/403 which will trigger a refresh access token process.

    const { data: userData, error: userDataError } =
      await supabaseClient.auth.getUser(accessToken);

    if (userDataError) {
      next(userDataError);
      return;
    }

    const parsedRequestBody = addToFavoritesParametersSchema.safeParse(
      request.body
    );

    if (!parsedRequestBody.success) {
      next(parsedRequestBody.error);
      return;
    }

    //? create the new Favorite record

    const newFavorite: AddToFavorite = {
      product_id: parsedRequestBody.data.id,
      user_id: userData.user.id,
    };

    const parsedNewFavorite = FavoriteSchema.pick({
      product_id: true,
      user_id: true,
    }).safeParse(newFavorite);

    if (!parsedNewFavorite.success) {
      next(parsedNewFavorite.error);
      return;
    }

    const {
      data: newFavoriteData,
      error: newFavoriteDataError,
      status: newFavoriteStatus,
      statusText,
    } = await supabaseClient
      .from("favorites")
      .insert(parsedNewFavorite.data, { count: "exact" })
      .select()
      .single();

    if (newFavoriteDataError) {
      next(newFavoriteDataError);
      return;
    }

    response.json({
      statusCode: newFavoriteStatus,
      message: statusText,
      data: {
        product_id: newFavoriteData.product_id,
        user_id: newFavoriteData.user_id,
      },
    });
  } catch (error) {
    next(error);
  }
}
