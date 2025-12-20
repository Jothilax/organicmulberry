import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  checkWishlist,
} from "./wishlist.controller.js";

const router = express.Router();

// All routes require authentication
router.post("/addToWishlist", authMiddleware, addToWishlist);
router.get("/getWishlist", authMiddleware, getWishlist);
router.delete("/removeFromWishlist/:id", authMiddleware, removeFromWishlist);
router.get("/checkWishlist/:product_id", authMiddleware, checkWishlist);

export default router;

