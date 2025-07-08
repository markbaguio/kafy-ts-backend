import { z } from "zod";
import { Response, Request, NextFunction } from "express";
import { signUpSchema } from "../utils/types";

export function validateSignUpRequestMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // try {
  //   signUpSchema.parse(request.body);
  //   next();
  // } catch (error) {
  //   next(error);
  // }
  const result = signUpSchema.safeParse(request.body);
  if (!result.success) {
    next(result.error);
    return;
  }
  next();
}
