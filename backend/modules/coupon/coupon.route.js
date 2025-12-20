import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getAvailableCoupons,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById,
} from "./coupon.controller.js";

const router = express.Router();

router.post("/create", createCoupon);
router.get("/getAll", getAllCoupons);
router.get("/available", getAvailableCoupons);
router.post("/validate", validateCoupon);
router.get("/:id", getCouponById);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;

