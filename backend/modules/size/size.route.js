// modules/size/size.routes.js
import express from "express";
import {
  createSize,
  getAllSizes,
  getSizeById,
  updateSize,
  deleteSize,
} from "./size.controller.js";

import { createSizeSchema, updateSizeSchema, sizeIdSchema } from "./size.zod.js";
import { validate } from "../../middleware/validate.js";
import { verifyToken } from "../../middleware/userAuth.js"; // 👈 import middleware

const router = express.Router();

router.post("/createSize", verifyToken, validate(createSizeSchema), createSize);
router.get("/getAllSizes", verifyToken, getAllSizes);
router.get("/getSizeById/:id", verifyToken, validate(sizeIdSchema), getSizeById);
router.put("/updateSize/:id", verifyToken, validate(updateSizeSchema), updateSize);
router.delete("/deleteSize/:id", verifyToken, validate(sizeIdSchema), deleteSize);

export default router;
