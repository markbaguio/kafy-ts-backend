import { z } from "zod";
import { Response, Request, NextFunction } from "express-serve-static-core";
import { ProfileSchema } from "../utils/types";

// type UpdatedProfileInput = z.infer<typeof UpdatedProfileSchema>;

export function validateUpdateProfileRequestMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const result = ProfileSchema.safeParse(request.body);
  if (!result.success) {
    next(result.error);
    return;
  }
  next();
}
