import { NextFunction, Request, Response } from "express-serve-static-core";
import supabaseClient from "../utils/supabaseClient";
import { getProfile, Profile } from "../database/Profile";
import { ApiResponse } from "../utils/ApiReponse";
import { CustomErrorMessage, CustomErrorName } from "../utils/constants";
import { CustomApiError } from "../utils/CustomApiError";

export async function getUserProfile(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const token = request.cookies["access_token"];

  try {
    const { data, error } = await supabaseClient.auth.getUser(token);

    if (error) {
      next(error);
      return;
    }

    const profile = await getProfile(data.user.id);

    if (!profile) {
      throw new CustomApiError(
        404,
        CustomErrorName.Profile_Not_Found,
        CustomErrorMessage.Profile_Not_Found_Message
      );
    }

    const res: ApiResponse<Profile> = {
      statusCode: 200,
      data: profile,
    };

    response.json(res);
  } catch (error) {
    next(error);
  }
}
