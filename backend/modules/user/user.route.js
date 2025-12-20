import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controllers.js";
import { login, logout, changePassword, forgotPassword } from './auth.controller.js';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "./user.zod.js";

import { validate } from "../../middleware/validate.js";

const router = express.Router();

// CRUD routes
router.post("/createUser", validate(createUserSchema), createUser);     // Create
router.get("/getAllUsers", getAllUsers);     // Read all
router.get("/getUserById/:id", validate(userIdSchema), getUserById);  // Read one
router.put("/updateUser/:id", validate(updateUserSchema), updateUser);   // Update
router.delete("/deleteUser/:id", validate(userIdSchema), deleteUser); // Delete

//auth routes

router.post("/login", login);
router.post("/logout", logout);
router.post("/changePassword", changePassword);
router.post("/forgotPassword", forgotPassword);


export default router;
