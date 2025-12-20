import express from "express";
import { createContact, getAllContacts } from "./contact.controller.js";

const router = express.Router();

router.post("/submit", createContact);
router.get("/getAllContacts", getAllContacts);

export default router;

