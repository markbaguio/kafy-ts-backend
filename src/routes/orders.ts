import { Router } from "express";
import {
  getLatestOrders,
  getOrders,
  postOrder,
} from "../handlers/ordersHandlers";

const orderRouter = Router();

orderRouter.post("/order", postOrder);
orderRouter.get("/orders", getOrders);
orderRouter.get("/orders/latest", getLatestOrders);

export default orderRouter;
