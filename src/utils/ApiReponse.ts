import { AuthError, AuthResponse, Session, User } from "@supabase/supabase-js";
import { ZodError } from "zod";

export type ApiResponse<T> = {
  statusCode: number;
  data: T | null;
  message?: string;
  error?: unknown;
};

//? Response for authentication (sign in and sign up)

// export type AuthenticationResponse = ApiResponse<
//   | {
//       user: User | null;
//       session: Session | null;
//     }
//   | {
//       user: null;
//       session: null;
//     }
// >;
export type AuthenticationResponse = ApiResponse<User>;
