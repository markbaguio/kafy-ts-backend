export type PostgrestErrorType = {
  code: string;
  details: string | null;
  hint: string | null;
  message: string | null;
};
