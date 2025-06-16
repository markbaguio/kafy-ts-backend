import { ApiResponse } from "./ApiReponse";

export class CustomApiError extends Error {
  constructor(
    public statusCode: number,
    public errorName: string,
    message: string
  ) {
    super(message);
    this.name = "CustomApiError";
  }

  toApiResponse(): ApiResponse<unknown> {
    return {
      statusCode: this.statusCode,
      errorName: this.errorName,
      message: this.message,
    };
  }
}
