import express from "express";
import { uploadCompanyCertification } from "../../middleware/upload.js";
import {
  createCompany,
  getCompanies,
  updateCompany,
  getCompanyById,
  deleteCompany,
} from "./company.controller.js";

import {
  createCompanySchema,
  updateCompanySchema,
} from "./company.zod.js";

import { validate } from "../../middleware/validate.js"; // your Zod middleware
import { verifyToken } from "../../middleware/userAuth.js"; // 👈 import middlewa
const router = express.Router();

// ✅ Create company with validation + certification upload
router.post(
  "/createCompany",
  uploadCompanyCertification.single("certificationFile"),
  validate(createCompanySchema),verifyToken,
  createCompany
);

// ✅ Get all companies
router.get("/getCompany", getCompanies);

// ✅ Update company with validation + certification upload
router.put(
  "/updateCompany/:id",
  uploadCompanyCertification.single("certificationFile"),
  validate(updateCompanySchema),verifyToken,
  updateCompany
);

// Fetch single company
router.get("/getCompanyById/:id", getCompanyById);

// Delete a company
router.delete("/deleteCompany/:id",verifyToken, deleteCompany);


export default router;
