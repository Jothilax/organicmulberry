import Customer from "../customer/customer.model.js";
import Order from "../order/order.model.js";
import OrderItem from "../order/oderItem.model.js";
import Product from "../products/product.model.js";
import Category from "../catregory/category.model.js";
import Size from "../size/size.model.js";
import Users from "../user/user.model.js";
import Role from "../role/role.model.js";
import Color from "../colour/colour.model.js"; // ✅ ADD THIS

// ============================
// DEFINE ALL ASSOCIATIONS HERE
// ============================

// 🧑‍💼 User ↔ Role
Role.hasMany(Users, { foreignKey: "user_role", as: "users" });
Users.belongsTo(Role, { foreignKey: "user_role", as: "roleData" });

// 🧍 Customer ↔ Orders
Customer.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(Customer, { foreignKey: "user_id", as: "customer" });

// 📦 Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// 🛍️ Product ↔ OrderItem
Product.hasMany(OrderItem, { foreignKey: "product_id", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// 🗂️ Product ↔ Category
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// 📏 Product ↔ Size
Size.hasMany(Product, { foreignKey: "size", as: "products" });
Product.belongsTo(Size, { foreignKey: "size", as: "sizeData" });

// 🎨 Product ↔ Color
Color.hasMany(Product, { foreignKey: "color", as: "products" });
Product.belongsTo(Color, { foreignKey: "color", as: "colorData" });

// ✅ EXPORT EVERYTHING
export {
  Customer,
  Order,
  OrderItem,
  Product,
  Category,
  Size,
  Users,
  Role,
  Color, // ✅ export Color
};
