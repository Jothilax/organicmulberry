import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { createRazorpayOrder, verifyPayment } from "./payment.controllers.js";

const router = express.Router();
router.post("/createRazorpayOrder", authMiddleware, createRazorpayOrder);
router.post("/verifyPayment", authMiddleware, verifyPayment);

export default router;
