import { NextFunction, Request, Response } from "express-serve-static-core";
import { ApiResponse } from "../utils/ApiReponse";
import { ZodError } from "zod";
import { isAuthApiError, isAuthError } from "@supabase/supabase-js";
import {
  isCustomApiError,
  isNoSessionError,
  isPostgrestError,
} from "../utils/utils";

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
    // errorName: "Error",
    // errorDetails: null,
  };

  //? Handle ZodError.
  if (error instanceof ZodError) {
    res.statusCode = 422;
    res.errorName = error.name;
    res.message = "Validation Error";
    res.errorDetails = error.flatten();
    // res.error = error.format();
    console.error(error);
  }
  //? Handle Supabase Auth Error(e.g., incorrect login, registration issues)
  else if (isAuthApiError(error)) {
    res.statusCode = error.status;
    res.errorName = error.name;
    res.message = error.message;
    res.errorDetails = error;
    console.error(error);
  } else if (isAuthError(error)) {
    res.statusCode = error.status ?? 500;
    res.errorName = error.name;
    res.message = error.message;
    res.errorDetails = error;
    console.error(error);
  } else if (isCustomApiError(error)) {
    res.statusCode = error.statusCode;
    res.errorName = error.errorName;
    res.message = error.message;
    // res.errorDetails = error.stack;
    console.error(error);
  } else if (isPostgrestError(error)) {
    console.log("biiiiiilaaat");
    res.statusCode = parseInt(error.code);
    res.message = error.message;
    res.errorDetails = error.details;
    console.error(error);
  }
  //? Handle general errors(like internal server errors)
  else if (error instanceof Error) {
    res.statusCode = 500; //? 500 for Internal Server Error.
    res.errorName = error.name;
    res.message = error.message;
    res.errorDetails = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
    console.error(error);
  }
  //? Handle if there is no session or no user signed in
  else if (isNoSessionError(error)) {
    res.statusCode = 400;
    res.message = error.message;
    res.errorName = error.errorName;
    res.errorDetails = error.errorDetails;
    console.error(Error(error.message));
  }
  //? In case of unknown error
  else {
    res.statusCode = 500;
    res.message = "An unknown error occurred.";
    res.errorName = "Error";
    res.errorDetails = { error: "Unkown Error" };
  }

  response.status(res.statusCode).json(res);
}
