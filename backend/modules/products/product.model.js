// models/Product.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "categories", // 👈 your table name for Category
        key: "id",
      },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "colour", // 👈 your table name for Category
        key: "color_id",
      },
    },
    pattern: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    style: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    threadCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    size: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "sizes", // 👈 your table name for Category
        key: "id",
      },
    },
    dimensions: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pocketDepth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    countryOfOrigin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    mrp: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    discountPercent: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    includedComponents: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    reviewsCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
    paranoid: true,
  }
);

export default Product;
