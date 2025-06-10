import { Router } from "express";
import {
  getRefreshProfile,
  refreshToken,
  signInUser,
  signOutUser,
  signUpNewUser,
} from "../handlers/authHandlers";
import { validateSignUpRequestMiddleware } from "../middlewares/validateSignUpRequestMiddleware";
import { validateSignInRequestMiddleware } from "../middlewares/validateSignInRequestMiddleware";

//? ADD Middleware to handle when access token is expired.

const authRouter = Router();

authRouter.post("/signup", validateSignUpRequestMiddleware, signUpNewUser);

authRouter.post("/signin", validateSignInRequestMiddleware, signInUser);

authRouter.post("/signout", signOutUser);

authRouter.post("/refresh-token", refreshToken);

authRouter.get("/me", getRefreshProfile);

export default authRouter;
