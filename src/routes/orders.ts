import { Router } from "express";
import { getOrders, postOrder } from "../handlers/ordersHandlers";

const orderRouter = Router();

orderRouter.post("/order", postOrder);
orderRouter.get("/orders", getOrders);

export default orderRouter;
