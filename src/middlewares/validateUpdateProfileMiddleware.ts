import { z } from "zod";
import { Response, Request, NextFunction } from "express-serve-static-core";

const ProfileSchema = z.object({
  id: z.string(),
  created_at: z.string().nullable().nullish(),
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  avatar_url: z.string().nullable().nullish(),
  email: z.string().email().nullish(),
  updated_at: z.string().nullable().nullish(),
});

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
