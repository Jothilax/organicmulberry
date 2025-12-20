import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { verifyToken } from "../../middleware/userAuth.js";
import { createOrderFromCart, getUserOrders, getAllOrders } from "./order.controllers.js";

const router = express.Router();
router.post("/createOrder", authMiddleware, createOrderFromCart);
router.get("/myOrders", authMiddleware, getUserOrders);
router.get("/getAll", verifyToken, getAllOrders); // Admin route

export default router;
