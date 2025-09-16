import { NextFunction, Request, Response } from "express-serve-static-core";
import { AddToFavoritesRequestBody } from "../database/types/Profile";
import supabaseClient from "../utils/supabaseClient";
import { ApiResponse } from "../utils/ApiReponse";
import { addToFavoritesParametersSchema } from "../schemas/ProductSchema";
import {
  AddToFavorite,
  AddToFavotireResponse,
  FavoriteSchema,
} from "../schemas/FavoriteSchema";
import { Favorite } from "../database/types/Favorite";

export async function addToFavorites(
  request: Request<{}, any, AddToFavoritesRequestBody, {}>, //? the fourth one is the query params
  response: Response<ApiResponse<AddToFavotireResponse>>,
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

export async function getUserFavorites(
  request: Request,
  response: Response<ApiResponse<Pick<Favorite, "product_id">[]>>,
  next: NextFunction
) {
  try {
    const accessToken = request.cookies["access_token"];

    const { data: userData, error: userDataError } =
      await supabaseClient.auth.getUser(accessToken);

    if (userDataError) {
      next(userDataError);
      return;
    }

    const {
      data: favoritesData,
      error: favoritesDataError,
      status: favoritesDataStatus,
    } = await supabaseClient
      .from("favorites")
      .select("product_id")
      .eq("user_id", userData.user.id);

    if (favoritesDataError) {
      next(favoritesDataError);
      return;
    }

    const res: ApiResponse<Pick<Favorite, "product_id">[]> = {
      statusCode: favoritesDataStatus,
      data: favoritesData,
    };

    response.json(res);
  } catch (error) {
    next(error);
  }
}
