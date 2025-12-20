import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "./category.zod.js";

import { validate } from "../../middleware/validate.js";
import { verifyToken } from "../../middleware/userAuth.js"; // JWT middleware

const router = express.Router();

// Protected routes (Admin only)
router.post("/createCategory", verifyToken, validate(createCategorySchema), createCategory);
router.put("/updateCategory/:id", verifyToken, validate(updateCategorySchema), updateCategory);
router.delete("/deleteCategory/:id", verifyToken, validate(categoryIdSchema), deleteCategory);

// Public routes (Customers can view)
router.get("/getAllCategories", getAllCategories);
router.get("/getCategoryById/:id", validate(categoryIdSchema), getCategoryById);

export default router;
