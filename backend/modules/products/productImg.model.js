import { DataTypes } from "sequelize";
import Product from "./product.model.js";
import sequelize from "../../config/db.js";

const ProductImage = sequelize.define("ProductImage", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "products", key: "id" },
    onDelete: "CASCADE",
  },
  images: {
    type: DataTypes.STRING,
    allowNull: false, // just store image filename like xyz.png
  },
  alt_text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
 is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
}, {
  tableName: "product_images",
  timestamps: true,
    paranoid: true,
});

Product.hasMany(ProductImage, { foreignKey: "product_id", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Product.hasMany(ProductImage, { foreignKey: "product_id", as: "images" });
// ProductImage.belongsTo(Product, { foreignKey: "product_id" });

export default ProductImage;
