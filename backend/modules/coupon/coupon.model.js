import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Coupon = sequelize.define("Coupon", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  discount_type: {
    type: DataTypes.ENUM("percentage", "fixed"),
    allowNull: false,
    defaultValue: "percentage",
  },
  discount_value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  min_purchase: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  max_discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  used_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "coupons",
  timestamps: true,
});

export default Coupon;

