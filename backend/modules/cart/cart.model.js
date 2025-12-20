import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Customer from "../customer/customer.model.js"; 
import Product from "../products/product.model.js";

const Cart = sequelize.define("Cart", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  cust_id: { type: DataTypes.UUID, allowNull: false,
    references : {
      model : "customers",
      key : "id"
    }
   },
  product_id: { type: DataTypes.UUID, allowNull: false ,
      references : {
      model : "products",
      key : "id"
    }
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
}, {
  tableName: "cart",
  timestamps: true,
});

// // ✅ Correct foreign keys
Product.hasMany(Cart, { foreignKey: "product_id" });
Cart.belongsTo(Product, { foreignKey: "product_id" });

Customer.hasMany(Cart, { foreignKey: "cust_id" });
Cart.belongsTo(Customer, { foreignKey: "cust_id" });

export default Cart;
