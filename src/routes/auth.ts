import { Router } from "express";
import {
  refreshToken,
  signInUser,
  signOutUser,
  signUpNewUser,
} from "../handlers/authHandlers";
import { validateSignUpRequestMiddleware } from "../middlewares/validateSignUpRequestMiddleware";
import { validateSignInRequestMiddleware } from "../middlewares/validateSignInRequestMiddleware";

const authRouter = Router();

authRouter.post("/signup", validateSignUpRequestMiddleware, signUpNewUser);

authRouter.post("/signin", validateSignInRequestMiddleware, signInUser);

authRouter.post("/signout", signOutUser);

authRouter.post("/refresh-token", refreshToken);

export default authRouter;
