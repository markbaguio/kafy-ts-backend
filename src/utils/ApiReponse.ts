import { Profile } from "../database/Profile";

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

export type ApiResponse<T> = {
  statusCode: number;
  data?: T | null;
  errorName?: string;
  message?: string;
  errorDetails?: unknown;
  pagination?: Pagination;
};

//? Response for authentication (sign in and sign up)

// export type AuthenticationResponse = ApiResponse<User>;
export type AuthenticationResponse = ApiResponse<Profile>;
