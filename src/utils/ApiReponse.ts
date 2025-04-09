import { AuthError, AuthResponse, Session, User } from "@supabase/supabase-js";
import { ZodError } from "zod";
import { Profile } from "../database/Profile";

export type ApiResponse<T> = {
  statusCode: number;
  data: T | null;
  message?: string;
  error?: unknown;
};

//? Response for authentication (sign in and sign up)

// export type AuthenticationResponse = ApiResponse<User>;
export type AuthenticationResponse = ApiResponse<Profile>;
