import { NextFunction, Request, Response } from "express-serve-static-core";
import supabaseClient from "../utils/supabaseClient";
import { getProfile, Profile } from "../database/Profile";
import { ApiResponse } from "../utils/ApiReponse";
import { CustomErrorMessage, CustomErrorName } from "../utils/constants";
import { CustomApiError } from "../utils/CustomApiError";
import { PostgrestError } from "@supabase/supabase-js";

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

//? BUG: responds with 200 but it doesn't update the record in the database. - FIXED
//? PROBLEM: No RLS policy for updating profile.
//? FIX: Create RLP policy to allow user to update their own profile.

//? PROBLEM: updated_at in supabase is timestampz
//? FIX: use new Date().toISOString()

//? BUG: PostgrestError is not being handled in the error handler middleware. - FIXED

export async function updateProfile(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id, ...data_input } = request.body;

  const updatedProfile = {
    ...data_input,
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabaseClient
      .from("profiles")
      // .update(updatedProfileInput)
      .update(updatedProfile)
      .eq("id", id)
      .select();

    if (error) {
      throw new PostgrestError({ ...error });
    }

    response.json(data);
  } catch (error) {
    next(error);
  }
}
