import { Router } from "express";
import { signUpNewUser } from "../handlers/authHandlers";
import { validateSignUpRequestMiddleware } from "../middlewares/validateSignUpRequestMiddleware";
import { validateSignInRequestMiddleware } from "../middlewares/validateSignInRequestMiddleware";

const authRouter = Router();

authRouter.post("/signup", validateSignUpRequestMiddleware, signUpNewUser);

authRouter.post("/signin", validateSignInRequestMiddleware);

export default authRouter;
