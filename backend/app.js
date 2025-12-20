import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import sequelize from "./config/db.js";
import { seedDatabase } from "./utils/seedAdmin.js";
import "./modules/associations/index.js"; // 👈 load associations first

dotenv.config();

const app = express();

// ✅ Proper CORS setup (only once)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], // React app URLs (both ports)
    credentials: true,
  })
);

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.COOKIE_SECURE === "true", // set true only if HTTPS
      httpOnly: process.env.COOKIE_HTTPONLY === "true",
      sameSite: process.env.COOKIE_SAMESITE || "Lax",
    },
  })
);

// ✅ Static uploads
app.use("/uploads", express.static("uploads"));

// ✅ Import routes
import Users from "./modules/user/user.route.js";
import Roles from "./modules/role/role.route.js";
import Sizes from "./modules/size/size.route.js";
import Category from "./modules/catregory/category.route.js";
import Product from "./modules/products/product.route.js";
import customerRoutes from "./modules/customer/customer.route.js";
import colorRoutes from "./modules/colour/colour.route.js";
import cartRoutes from "./modules/cart/cart.route.js";
import orderRoutes from "./modules/order/order.route.js";
import companyRoutes from "./modules/company/company.route.js";
import wishlistRoutes from "./modules/wishlist/wishlist.route.js";
import contactRoutes from "./modules/contact/contact.route.js";
import couponRoutes from "./modules/coupon/coupon.route.js";

// ✅ Use routes
app.use("/api/users", Users);
app.use("/api/roles", Roles);
app.use("/api/sizes", Sizes);
app.use("/api/categories", Category);
app.use("/api/products", Product);
app.use("/api/customer", customerRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/coupon", couponRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Server is running fine 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`✅ Server is running on port ${PORT}`);
  try {
    await sequelize.sync({alter : true});
    console.log("✅ Database synchronized");
     await seedDatabase(); // seed admin only if needed
  } catch (error) {
    console.error("❌ Error synchronizing database:", error);
  }
});
