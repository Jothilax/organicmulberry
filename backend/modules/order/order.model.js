import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Order = sequelize.define("Order", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  total_amount: { type: DataTypes.FLOAT, allowNull: false },
  status: {
    type: DataTypes.ENUM("pending", "paid", "shipped", "delivered", "cancelled"),
    defaultValue: "pending",
  },
  payment_method: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  order_code: { type: DataTypes.STRING, allowNull: true, unique: true },
  qr_code: { type: DataTypes.TEXT, allowNull: true }, // Store QR code as base64 string
  created_by: { type: DataTypes.UUID },
  updated_by: { type: DataTypes.UUID },
}, { tableName: "orders", timestamps: true });

export default Order;
