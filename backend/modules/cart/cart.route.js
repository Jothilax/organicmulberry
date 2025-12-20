import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { addToCart, getCart, removeFromCart } from "./cart.controllers.js";

const router = express.Router();
router.post("/addToCart", authMiddleware, addToCart);
router.get("/getCart", authMiddleware, getCart);
router.delete("/removeFromCart/:id", authMiddleware, removeFromCart);

export default router;
