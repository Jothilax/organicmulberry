// import express from "express";
// import {
//   createColor,
//   getAllColors,
//   getColorById,
//   updateColor,
//   deleteColor
// } from "./colour.controller.js";
// import { validate } from "../../middleware/validate.js";
// import { createColorSchema, updateColorSchema ,colorIdSchema } from "./colour.zod.js";

// const router = express.Router();


// router.post("/createColor", validate(createColorSchema), createColor);
// router.get("/getAllColors", getAllColors);
// router.get("/getColorById/:id", validate(colorIdSchema), getColorById);
// router.put("/updateColor/:id", validate(updateColorSchema), updateColor);
// router.delete("/deleteColor/:id", validate(colorIdSchema), deleteColor);

// export default router;

import express from "express";
import {
  createColor,
  getAllColors,
  getColorById,
  updateColor,
  deleteColor,
} from "./colour.controller.js";

import {
  createColorSchema,
  updateColorSchema,
  colorIdSchema,
} from "./colour.zod.js";

import { validate } from "../../middleware/validate.js";
import { verifyToken } from "../../middleware/userAuth.js"; // ✅ Add this

const router = express.Router();

// 🔐 Protected routes
router.post("/createColor", verifyToken, validate(createColorSchema), createColor);
router.get("/getAllColors", verifyToken, getAllColors);
router.get("/getColorById/:id", verifyToken, validate(colorIdSchema), getColorById);
router.put("/updateColor/:id", verifyToken, validate(updateColorSchema), updateColor);
router.delete("/deleteColor/:id", verifyToken, validate(colorIdSchema), deleteColor);

export default router;
