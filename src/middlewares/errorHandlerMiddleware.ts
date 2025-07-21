import { NextFunction, Request, Response } from "express-serve-static-core";
import { ApiResponse } from "../utils/ApiReponse";
import { ZodError } from "zod";
import { isAuthApiError, isAuthError } from "@supabase/supabase-js";
import {
  isCustomApiError,
  isNoSessionError,
  isPostgrestError,
} from "../utils/utils";
import { CustomErrorName } from "../utils/constants";
import { PostgrestErrorType } from "../database/types/PostgrestErrorType";

const IS_DEV = process.env.NODE_ENV === "development";

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
  };

  //? Handle ZodError.
  if (error instanceof ZodError) {
    res.statusCode = 422;
    res.errorName = error.name;
    if (IS_DEV) {
      res.message = "Validation Error";
      res.errorDetails = error.flatten();
    }
    console.error(error);
  }
  //? Handle Supabase Auth Error(e.g., incorrect login, registration issues)
  else if (isAuthApiError(error)) {
    res.statusCode = error.status;
    res.errorName = error.name;
    if (IS_DEV) {
      res.message = error.message;
      res.errorDetails = error;
    }
    console.error(error);
  } else if (isAuthError(error)) {
    res.statusCode = error.status ?? 500;
    res.errorName = error.name;
    if (IS_DEV) {
      res.message = error.message;
      res.errorDetails = error;
    }
    console.error(error);
  } else if (isCustomApiError(error)) {
    res.statusCode = error.statusCode;
    res.errorName = error.errorName;
    if (IS_DEV) {
      res.message = error.message;
      // res.errorDetails = error.stack;
    }
    console.error(error);
  } else if (isPostgrestError(error)) {
    res.statusCode = 500;
    res.errorName = CustomErrorName.PostgrestError;
    res.message = error.message;
    if (IS_DEV) {
      res.errorDetails = {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
      } satisfies PostgrestErrorType;
    }
    console.error(error);
  }
  //? Handle general errors(like internal server errors)
  else if (error instanceof Error) {
    res.statusCode = 500; //? 500 for Internal Server Error.
    res.errorName = error.name;
    if (IS_DEV) {
      res.message = error.message;
      res.errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    console.error(error);
  }
  //? Handle if there is no session or no user signed in
  else if (isNoSessionError(error)) {
    res.statusCode = 400;
    res.errorName = error.errorName;
    if (IS_DEV) {
      res.message = error.message;
      res.errorDetails = error.errorDetails;
    }
    console.error(Error(error.message));
  }
  //? In case of unknown error
  else {
    res.statusCode = 500;
    res.errorName = "Error";
    if (IS_DEV) {
      res.message = "An unknown error occurred.";
      res.errorDetails = { error: "Unkown Error" };
    }
    console.error(error);
  }

  response.status(res.statusCode).json(res);
}
