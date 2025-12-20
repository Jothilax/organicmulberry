import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Customer from "../customer/customer.model.js";
import Product from "../products/product.model.js";

const Wishlist = sequelize.define("Wishlist", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cust_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "customers",
      key: "id",
    },
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "products",
      key: "id",
    },
  },
}, {
  tableName: "wishlist",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["cust_id", "product_id"], // Prevent duplicate wishlist items
    },
  ],
});

// Associations
Product.hasMany(Wishlist, { foreignKey: "product_id", as: "wishlistItems" });
Wishlist.belongsTo(Product, { foreignKey: "product_id", as: "product" });

Customer.hasMany(Wishlist, { foreignKey: "cust_id", as: "wishlist" });
Wishlist.belongsTo(Customer, { foreignKey: "cust_id", as: "customer" });

export default Wishlist;

