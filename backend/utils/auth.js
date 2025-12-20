import crypto from "crypto";
import bcrypt from "bcryptjs";

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
export const generateRandomPassword = () => crypto.randomBytes(6).toString("hex");
export const hashPassword = async (password) => await bcrypt.hash(password, 10);
export const comparePassword = async (password, hash) => await bcrypt.compare(password, hash);
