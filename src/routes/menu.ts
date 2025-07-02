import { Router } from "express";
import { getMenu } from "../handlers/menuHandlers";

const menuRouter = Router();

menuRouter.get("/menu/:page", getMenu);

export default menuRouter;
