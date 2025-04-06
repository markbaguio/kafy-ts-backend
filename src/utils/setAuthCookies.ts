import { Response } from "express-serve-static-core";

type setAuthCookiesParameters = {
  response: Response;
  accessToken: string;
  refreshToken: string;
};

export function setAuthCookies({
  response,
  accessToken,
  refreshToken,
}: setAuthCookiesParameters) {
  const isProduction = process.env.ENVIRONMENT === "production";

  //? Delete existing cookies before setting new ones.
  response.clearCookie("access_token");
  response.clearCookie("refresh_token");

  //? Set cookies for access token and refresh token.
  response.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    path: "/", // cookie is valid for the entire domain
  });
  response.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days in milliseconds
  });
}
