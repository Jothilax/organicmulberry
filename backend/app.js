// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import session from "express-session";
// import sequelize from "./config/db.js";
// import { seedDatabase } from "./utils/seedAdmin.js";
// import "./modules/associations/index.js"; // 👈 load associations first

// dotenv.config();

// const app = express();

// // ✅ Proper CORS setup (only once)
// // app.use(
// //   cors({
// //     origin: ["https://organicmulberry-za3t-9ajdvp9uy-jothilakshmis-projects.vercel.app"], // React app URLs (both ports)
// //     credentials: true,
// //   })
// // );

// const allowedOrigins = [
//   "https://organicmulberry-za3t-9ajdvp9uy-jothilakshmis-projects.vercel.app"
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true,
//   })
// );

// // ✅ IMPORTANT: handle preflight
// app.options("*", cors());


// // ✅ Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "default_secret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: process.env.COOKIE_SECURE === "true", // set true only if HTTPS
//       httpOnly: process.env.COOKIE_HTTPONLY === "true",
//       sameSite: process.env.COOKIE_SAMESITE || "Lax",
//     },
//   })
// );

// // ✅ Static uploads
// app.use("/uploads", express.static("uploads"));

// // ✅ Import routes
// import Users from "./modules/user/user.route.js";
// import Roles from "./modules/role/role.route.js";
// import Sizes from "./modules/size/size.route.js";
// import Category from "./modules/catregory/category.route.js";
// import Product from "./modules/products/product.route.js";
// import customerRoutes from "./modules/customer/customer.route.js";
// import colorRoutes from "./modules/colour/colour.route.js";
// import cartRoutes from "./modules/cart/cart.route.js";
// import orderRoutes from "./modules/order/order.route.js";
// import companyRoutes from "./modules/company/company.route.js";
// import wishlistRoutes from "./modules/wishlist/wishlist.route.js";
// import contactRoutes from "./modules/contact/contact.route.js";
// import couponRoutes from "./modules/coupon/coupon.route.js";

// // ✅ Use routes
// app.use("/api/users", Users);
// app.use("/api/roles", Roles);
// app.use("/api/sizes", Sizes);
// app.use("/api/categories", Category);
// app.use("/api/products", Product);
// app.use("/api/customer", customerRoutes);
// app.use("/api/colors", colorRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/order", orderRoutes);
// app.use("/api/company", companyRoutes);
// app.use("/api/wishlist", wishlistRoutes);
// app.use("/api/contact", contactRoutes);
// app.use("/api/coupon", couponRoutes);

// // ✅ Health check
// app.get("/", (req, res) => {
//   res.send("Server is running fine 🚀");
// });

// // ✅ Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, '0.0.0.0', async () => {
//   console.log(`✅ Server is running on port ${PORT}`);
//   try {
//     // await sequelize.sync({alter : true});
//      await sequelize.sync();
//     console.log("✅ Database synchronized");
//      await seedDatabase(); // seed admin only if needed
//   } catch (error) {
//     console.error("❌ Error synchronizing database:", error);
//   }
// });


// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import session from "express-session";
// import bodyParser from "body-parser";

// import sequelize from "./config/db.js";
// import { seedDatabase } from "./utils/seedAdmin.js";
// import "./modules/associations/index.js";

// // Routes
// import Users from "./modules/user/user.route.js";
// import Roles from "./modules/role/role.route.js";
// import Sizes from "./modules/size/size.route.js";
// import Category from "./modules/catregory/category.route.js";
// import Product from "./modules/products/product.route.js";
// import customerRoutes from "./modules/customer/customer.route.js";
// import colorRoutes from "./modules/colour/colour.route.js";
// import cartRoutes from "./modules/cart/cart.route.js";
// import orderRoutes from "./modules/order/order.route.js";
// import companyRoutes from "./modules/company/company.route.js";
// import wishlistRoutes from "./modules/wishlist/wishlist.route.js";
// import contactRoutes from "./modules/contact/contact.route.js";
// import couponRoutes from "./modules/coupon/coupon.route.js";

// dotenv.config();

// const app = express();

// /* =========================================================
//    ✅ CORS CONFIG (MUST BE FIRST)
// ========================================================= */
// const allowedOrigins = [
//   "https://organicmulberry-za3t-9ajdvp9uy-jothilakshmis-projects.vercel.app",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );

// // ✅ Preflight support
// app.options("*", cors());

// /* =========================================================
//    ✅ BODY PARSER
// ========================================================= */
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// /* =========================================================
//    ✅ SESSION CONFIG (REQUIRED FOR CROSS-ORIGIN LOGIN)
// ========================================================= */
// app.use(
//   session({
//     name: "organicmulberry.sid",
//     secret: process.env.SESSION_SECRET || "default_secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: true,        // Render is HTTPS
//       httpOnly: true,
//       sameSite: "None",    // REQUIRED for Vercel → Render
//     },
//   })
// );

// /* =========================================================
//    ✅ STATIC FILES
// ========================================================= */
// app.use("/uploads", express.static("uploads"));

// /* =========================================================
//    ✅ API ROUTES
// ========================================================= */
// app.use("/api/users", Users);
// app.use("/api/roles", Roles);
// app.use("/api/sizes", Sizes);
// app.use("/api/categories", Category);
// app.use("/api/products", Product);
// app.use("/api/customer", customerRoutes);
// app.use("/api/colors", colorRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/order", orderRoutes);
// app.use("/api/company", companyRoutes);
// app.use("/api/wishlist", wishlistRoutes);
// app.use("/api/contact", contactRoutes);
// app.use("/api/coupon", couponRoutes);

// /* =========================================================
//    ✅ HEALTH CHECK
// ========================================================= */
// app.get("/", (req, res) => {
//   res.send("Server is running fine 🚀");
// });

// /* =========================================================
//    ✅ START SERVER (RENDER SAFE)
// ========================================================= */
// const PORT = process.env.PORT;

// app.listen(PORT, "0.0.0.0", async () => {
//   console.log(`✅ Server running on port ${PORT}`);

//   try {
//     await sequelize.sync();
//     console.log("✅ Database synchronized");
//     await seedDatabase();
//   } catch (error) {
//     console.error("❌ DB sync error:", error);
//   }
// });


import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";

import sequelize from "./config/db.js";
import { seedDatabase } from "./utils/seedAdmin.js";
import "./modules/associations/index.js";

// Routes
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

dotenv.config();

const app = express();

/* ======================================================
   ✅ CORS (MUST BE FIRST)
====================================================== */
const allowedOrigins = [
  "https://organicmulberry-za3t-9ajdvp9uy-jothilakshmis-projects.vercel.app",
  "https://organicmulberry-l8im.vercel.app/login",
  "https://organicmulberry-admin.vercel.app/"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ Preflight support
app.options("*", cors());

/* ======================================================
   ✅ BODY PARSER
====================================================== */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ======================================================
   ✅ SESSION (FIXED FOR CROSS-ORIGIN)
====================================================== */
app.use(
  session({
    name: "organicmulberry.sid",
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,       // REQUIRED (HTTPS on Render)
      httpOnly: true,
      sameSite: "None",   // REQUIRED for Vercel → Render
    },
  })
);

/* ======================================================
   ✅ STATIC FILES
====================================================== */
app.use("/uploads", express.static("uploads"));

/* ======================================================
   ✅ ROUTES
====================================================== */
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

/* ======================================================
   ✅ HEALTH CHECK
====================================================== */
app.get("/", (req, res) => {
  res.send("Server is running fine 🚀");
});

/* ======================================================
   ✅ START SERVER (RENDER SAFE)
====================================================== */
const PORT = process.env.PORT; // ❗ DO NOT hardcode

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`✅ Server running on port ${PORT}`);

  try {
    await sequelize.sync();
    console.log("✅ Database synchronized");
    await seedDatabase();
  } catch (error) {
    console.error("❌ DB sync error:", error);
  }
});
