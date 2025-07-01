import { Router } from "express";
import { getMenu } from "../handlers/menuHandlers";

const menuRouter = Router();

menuRouter.get("/menu", getMenu);

export default menuRouter;
