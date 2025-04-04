import { Router } from "express";
import { signUpNewUser } from "../handlers/authHandlers";
import { validateSignUpRequestMiddleware } from "../middlewares/validateSignUpRequestMiddleware";

const authRouter = Router();

authRouter.post("/signup", validateSignUpRequestMiddleware, signUpNewUser);

export default authRouter;
