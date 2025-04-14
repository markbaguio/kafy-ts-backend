import { Profile } from "../database/Profile";

export type ApiResponse<T> = {
  statusCode: number;
  data?: T | null;
  errorName?: string;
  message?: string;
  errorDetails?: unknown;
};

//? Response for authentication (sign in and sign up)

// export type AuthenticationResponse = ApiResponse<User>;
export type AuthenticationResponse = ApiResponse<Profile>;
