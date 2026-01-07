import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { verifyToken } from "../../middleware/userAuth.js";
import { createOrderFromCart, getUserOrders,generateOrderPDF, getAllOrders , downloadOrdersExcel} from "./order.controllers.js";

const router = express.Router();
router.post("/createOrder", authMiddleware, createOrderFromCart);
router.get("/myOrders", authMiddleware, getUserOrders);
router.get("/generateOrderPDF/:order_id", authMiddleware, generateOrderPDF);
router.get("/getAll", verifyToken, getAllOrders); // Admin route
router.get("/downloadOrdersExcel", verifyToken, downloadOrdersExcel); // Admin route

export default router;
