import { NextFunction, Request, Response } from "express-serve-static-core";
import supabaseClient from "../utils/supabaseClient";
import { ApiResponse, AuthenticationResponse } from "../utils/ApiReponse";

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

    // handle success
    const res: AuthenticationResponse = {
      statusCode: 201,
      data: data,
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
  } catch (err) {
    next(err);
  }
}
