// import express from "express";
// import { sendOTP, verifyOTP } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/send-otp", sendOTP);
// router.post("/verify-otp", verifyOTP);

// export default router;


import express from "express";
import { requestOTP, verifyOTP, updateProfile , getProfile,getAllCustomers } from "./customer.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { signupSchema ,updateProfileSchema } from "./customer.zod.js";

import { validate } from "../../middleware/validate.js"; // your Zod middleware

const router = express.Router();

router.post("/requestOtp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.put(
  "/updateProfile",
  authMiddleware,
  validate(updateProfileSchema),
  updateProfile
);
router.get("/getProfile", authMiddleware, getProfile);
router.get("/getAllCustomers", getAllCustomers);
export default router;
