import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Order from "../order/oderItem.model.js"; // ✅ Make sure this path is correct

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  name: {
    type: DataTypes.STRING,
     allowNull: true,
  },
  gender: { type: DataTypes.ENUM("Male", "Female", "Other"), allowNull: true },

  password: { type: DataTypes.STRING, allowNull: true },

  address: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: true },
  state: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  pincode: { type: DataTypes.STRING ,allowNull: true },
  landmark: { type: DataTypes.STRING ,allowNull: true },
  
},{
tableName: "customers",   // 👈 table name override
    timestamps: true,      // adds createdAt & updatedAt
   

});


// ========================================================
// ✅ ASSOCIATIONS
// // ========================================================
// Customer.hasMany(Order, {
//   foreignKey: "user_id",  // field name in the orders table
//   as: "orders",           // alias used when including
// });

// Order.belongsTo(Customer, {
//   foreignKey: "user_id",
//   as: "customer",
// });

export default Customer;
