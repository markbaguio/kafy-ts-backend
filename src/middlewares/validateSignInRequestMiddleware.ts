import { z } from "zod";
import { Response, Request, NextFunction } from "express-serve-static-core";
import { SignInSchema } from "../schemas/signInSchema";

export function validateSignInRequestMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // try {
  //   signInSchema.parse(request.body);
  //   next();
  // } catch (error) {
  //   next(error);
  // }
  const result = SignInSchema.safeParse(request.body);
  if (!result.success) {
    next(result.error);
    return;
  }
  next();
}
