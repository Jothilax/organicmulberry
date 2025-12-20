import express from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "./role.controller.js";

import {
  createRoleSchema,
  updateRoleSchema,
  roleIdSchema,
} from "./role.zod.js";

import { validate } from "../../middleware/validate.js";
import { verifyToken } from "../../middleware/userAuth.js"; // 👈 import middleware

const router = express.Router();

// 🔒 All routes protected
router.post("/createRole", verifyToken, validate(createRoleSchema), createRole);
router.get("/getAllRoles", verifyToken, getAllRoles);
router.get("/getRoleById/:id", verifyToken, validate(roleIdSchema), getRoleById);
router.put("/updateRole/:id", verifyToken, validate(updateRoleSchema), updateRole);
router.delete("/deleteRole/:id", verifyToken, validate(roleIdSchema), deleteRole);

export default router;
