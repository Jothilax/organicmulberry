import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Order from "../order/order.model.js";

const Payment = sequelize.define("Payment", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  order_id: { type: DataTypes.UUID, allowNull: false },
  razorpay_order_id: { type: DataTypes.STRING, allowNull: false },
  razorpay_payment_id: { type: DataTypes.STRING },
  razorpay_signature: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM("created", "paid", "failed"), defaultValue: "created" },
}, { tableName: "payments", timestamps: true });

Order.hasOne(Payment, { foreignKey: "order_id", as: "payment" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

export default Payment;
