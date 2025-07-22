import { Router } from "express";
import { getMenu, getProduct } from "../handlers/menuHandlers";

const menuRouter = Router();

menuRouter.get("/menu", getMenu);

menuRouter.get("/menu/:product_id", getProduct);

export default menuRouter;
