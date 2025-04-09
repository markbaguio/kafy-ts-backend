import { NextFunction, Request, Response } from "express-serve-static-core";
import supabaseClient from "../utils/supabaseClient";
import { ApiResponse, AuthenticationResponse } from "../utils/ApiReponse";
import { setAuthCookies } from "../utils/setAuthCookies";
import { User } from "@supabase/supabase-js";
import { getProfile, Profile } from "../database/Profile";

export async function signUpNewUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    //Extract user data from the request.body
    const { firstName, lastName, email, password } = request.body;

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    // send error to handleErrorMiddleware which will handle all errors.
    if (error) {
      next(error);
      return;
    }

    // get Profile
    const profile: Profile = await getProfile(data.user!.id);

    // Set Cookies - send cookies to the client
    setAuthCookies({
      response,
      accessToken: data.session?.access_token!,
      refreshToken: data.session?.refresh_token!,
    });

    // handle success
    const res: AuthenticationResponse = {
      statusCode: 201,
      data: profile,
      message: "User signed up successfully.",
    };

    response.status(res.statusCode).json(res);
  } catch (err) {
    next(err);
  }
}

export async function signInUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email, password } = request.body;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      next(error);
      return;
    }

    const profile: Profile = await getProfile(data.user.id);
    // send cookies to the client.
    setAuthCookies({
      response,
      accessToken: data.session?.access_token!,
      refreshToken: data.session?.refresh_token!,
    });

    // console.log(response.getHeader("Set-Cookie")); //? for testing

    // handle success
    const res: AuthenticationResponse = {
      statusCode: 200,
      data: profile,
      message: "User signed in successfully.",
    };

    response.status(res.statusCode).json(res);
  } catch (err) {
    next(err);
  }
}

export async function signOutUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    // check if user is signed in or not.
    // if user is not signed in, return error response.
    if (!user) {
      const res: ApiResponse<null> = {
        statusCode: 400,
        data: null,
        message: "No user currently signed in.",
      };
      response.status(400).json(res);
      console.log(Error("No user currently signed in."));
      return;
    }

    // sign out user.
    const { error } = await supabaseClient.auth.signOut();

    // if error is present, send it to the next middleware.
    // send error to handleErrorMiddleware which will handle all errors.
    if (error) {
      next(error);
      return;
    }

    //? remove cookied when loging out.
    response.clearCookie("access_token");
    response.clearCookie("refresh_token");

    // handle success
    const res: ApiResponse<null> = {
      statusCode: 200,
      data: null,
      message: "User signed out successfully.",
    };

    response.status(res.statusCode).json(res);
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const refreshToken: string = request.cookies.refresh_token;

    if (!refreshToken) {
      const res: ApiResponse<null> = {
        statusCode: 400,
        data: null,
        message: "No refresh token found.",
      };
      response.status(401).json(res);
      return;
    }

    // if refresh token is present, send it to the supabase client to get new access token.

    const { data, error } = await supabaseClient.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      next(error);
      return;
    }

    // set cookies to the client if there are no errors.
    setAuthCookies({
      response,
      accessToken: data.session?.access_token!,
      refreshToken: data.session?.refresh_token!,
    });

    // console.log(response.getHeader("Set-Cookie")); //? for testing

    const res: ApiResponse<User> = {
      statusCode: 200,
      data: data.user,
      message: "Token refreshed successfully.",
    };

    response.status(res.statusCode).json(res);
  } catch (error) {
    next(error);
  }
}
