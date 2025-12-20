import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const generateToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
export const verifyToken = (token) => jwt.verify(token, SECRET_KEY);
