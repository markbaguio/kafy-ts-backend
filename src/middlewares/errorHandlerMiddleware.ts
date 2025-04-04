import { NextFunction, Request, Response } from "express-serve-static-core";
import { ApiResponse } from "../utils/ApiReponse";
import { ZodError } from "zod";
import { isAuthApiError } from "@supabase/supabase-js";

export function errorHandlerMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  let res: ApiResponse<null> = {
    statusCode: 500,
    data: null,
    message: "An unexpected error occurred.",
    error: null,
  };

  //? Handle ZodError.
  if (error instanceof ZodError) {
    res.statusCode = 400;
    res.message = "Validation Error";
    res.error = error.flatten();
    console.error(error);
  }
  //? Handle Supabase Auth Error(e.g., incorrect login, registration issues)
  else if (isAuthApiError(error)) {
    res.statusCode = error.status;
    res.message = error.message;
    res.error = error;
    console.error(error);
  }
  //? Handle general errors(like internal server errors)
  else if (error instanceof Error) {
    res.statusCode = 500; //? 500 for Internal Server Error.
    res.message = error.message;
    res.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
    console.error(error);
  }
  //? In case of unknown error
  else {
    res.statusCode = 500;
    res.message = "An unknown error occurred.";
    res.error = { error: "Unkown Error" };
  }

  response.status(res.statusCode).json(res);
}
