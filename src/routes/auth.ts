import { Router } from "express";
import { signInUser, signUpNewUser } from "../handlers/authHandlers";
import { validateSignUpRequestMiddleware } from "../middlewares/validateSignUpRequestMiddleware";
import { validateSignInRequestMiddleware } from "../middlewares/validateSignInRequestMiddleware";

const authRouter = Router();

authRouter.post("/signup", validateSignUpRequestMiddleware, signUpNewUser);

authRouter.post("/signin", validateSignInRequestMiddleware, signInUser);

export default authRouter;
