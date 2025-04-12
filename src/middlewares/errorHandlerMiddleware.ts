import { NextFunction, Request, Response } from "express-serve-static-core";
import { ApiResponse } from "../utils/ApiReponse";
import { ZodError } from "zod";
import { isAuthApiError, isAuthError } from "@supabase/supabase-js";

// TODO: Create a getErrorMessage that will extract the message from ZodError, AuthApiError, Error or a string. Then send that to the front end as the message.

export function errorHandlerMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  //? Omit error in the ApiResponse since it's not needed on the frontend.
  let res: ApiResponse<null> = {
    statusCode: 500,
    message: "An unexpected error occurred.",
    errorName: "Error",
    // error: null,
  };

  //? Handle ZodError.
  if (error instanceof ZodError) {
    res.statusCode = 422;
    res.errorName = error.name;
    res.message = "Validation Error";
    // res.error = error.flatten();
    // res.error = error.format();
    console.error(error);
  }
  //? Handle Supabase Auth Error(e.g., incorrect login, registration issues)
  else if (isAuthApiError(error)) {
    res.statusCode = error.status;
    res.errorName = error.name;
    res.message = error.message;
    // res.error = error;
    console.error(error);
  } else if (isAuthError(error)) {
    res.statusCode = error.status ?? 500;
    res.errorName = res.errorName;
    res.message = error.message;
    // res.error = error;
    console.error(error);
  }
  //? Handle general errors(like internal server errors)
  else if (error instanceof Error) {
    res.statusCode = 500; //? 500 for Internal Server Error.
    res.errorName = error.name;
    res.message = error.message;
    // res.error = {
    //   name: error.name,
    //   message: error.message,
    //   stack: error.stack,
    // };
    console.error(error);
  }
  //? In case of unknown error
  else {
    res.statusCode = 500;
    res.message = "An unknown error occurred.";
    res.errorName = "Error";
    // res.error = { error: "Unkown Error" };
  }

  response.status(res.statusCode).json(res);
}
