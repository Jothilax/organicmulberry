// modules/category/category.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: "categories",
  timestamps: true,
  paranoid: true, // soft delete
});

export default Category;
