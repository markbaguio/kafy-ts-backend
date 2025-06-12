import { Router } from "express";
import { getUserProfile } from "../handlers/profileHandlers";

const profileRouter = Router();

profileRouter.get("/profile", getUserProfile);

export default profileRouter;
