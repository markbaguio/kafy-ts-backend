import { Router } from "express";
import { signUpNewUser } from "../handlers/authHandlers";

const authRouter = Router();

authRouter.post("/signup", signUpNewUser);

export default authRouter;
