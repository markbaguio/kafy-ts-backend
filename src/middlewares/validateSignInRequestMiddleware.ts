import { z } from "zod";
import { Response, Request, NextFunction } from "express-serve-static-core";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export function validateSignInRequestMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    signInSchema.parse(request.body);
    next();
  } catch (error) {
    next(error);
  }
}
