import { z } from "zod";
import { Response, Request, NextFunction } from "express";
import { SignUpSchema } from "../schemas/signUpSchema";

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
  const result = SignUpSchema.safeParse(request.body);
  if (!result.success) {
    next(result.error);
    return;
  }
  next();
}
