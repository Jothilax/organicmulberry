import { verifyToken } from "../utils/jwt.js";
import Customer from "../modules/customer/customer.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const customer = await Customer.findByPk(decoded.id);
    if (!customer) return res.status(401).json({ message: "Unauthorized" });

    req.customer = customer;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

