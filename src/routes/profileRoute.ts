import { Router } from "express";
import { getUserProfile, updateProfile } from "../handlers/profileHandlers";
import { validateUpdateProfileRequestMiddleware } from "../middlewares/validateUpdateProfileMiddleware";

const profileRouter = Router();

profileRouter.get("/profile", getUserProfile);

profileRouter.patch(
  "/profile",
  validateUpdateProfileRequestMiddleware,
  updateProfile
);

export default profileRouter;
