import { Profile } from "../database/types/Profile";

export type CustomPagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
};

export type ApiResponse<T = null> = {
  statusCode: number;
  data?: T | null;
  errorName?: string;
  message?: string;
  errorDetails?: unknown;
};

//? Response for authentication (sign in and sign up)

// export type AuthenticationResponse = ApiResponse<User>;
export type AuthenticationResponse = ApiResponse<Profile>;
