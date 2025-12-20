
// routes/product.routes.js
import express from "express";
import { uploadMultiple } from "../../middleware/productupload.js";
import {
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  deleteProductImage,getCustomerOrders,getOrderItems
} from "./product.controller.js";
import { verifyToken } from "../../middleware/userAuth.js";
import { validate } from "../../middleware/validate.js";
import { createProductSchema, updateProductSchema, productIdSchema } from "./product.zod.js";

const router = express.Router();

// ✅ Create Product (with images)
router.post(
  "/createProduct", 
  verifyToken, 
  uploadMultiple, 
  validate(createProductSchema), 
  createProduct
);

// ✅ Update Product (with optional images)
router.put(
  "/updateProduct/:id", 
  verifyToken, 
  uploadMultiple, 
  validate(updateProductSchema), 
  updateProduct
);

// ✅ Get All Products (Public - customers can view)
router.get("/getAllProducts", getAllProducts);

// ✅ Get Product by ID (Public - customers can view)
router.get(
  "/getProductById/:id", 
  validate(productIdSchema), 
  getProductById
);

// ✅ Delete Product
router.delete(
  "/deleteProduct/:id", 
  verifyToken, 
  validate(productIdSchema), 
  deleteProduct
);

// ✅ Delete Single Product Image
router.delete(
  "/deleteProductImage/:id", 
  verifyToken, 
  deleteProductImage
);

// ✅ Get Orders of a Customer
router.get("/getCustomerOrders/:customerId", getCustomerOrders);

// ✅ Get Items of a Specific Order
router.get("/getOrderItems/:orderId", getOrderItems);

export default router;
