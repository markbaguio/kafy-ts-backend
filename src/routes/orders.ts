import { Router } from "express";
import { postOrder } from "../handlers/ordersHandlers";

const orderRouter = Router();

orderRouter.post("/order", postOrder);

export default orderRouter;
