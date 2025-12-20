import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Order from "./order.model.js";
import Product from "../products/product.model.js";

const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

  order_id: { type: DataTypes.UUID, allowNull: false },
  product_id: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  price: { type: DataTypes.FLOAT, allowNull: false }, // store snapshot price
}, { tableName: "order_items", timestamps: true });

// Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
// OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// Product.hasMany(OrderItem, { foreignKey: "product_id" });
// OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

export default OrderItem;
