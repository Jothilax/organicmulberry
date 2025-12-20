import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Color = sequelize.define(
  "Color",
  {
    color_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    color_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color_code: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    tableName: "colour",   // 👈 table name override
    timestamps: true,      // adds createdAt & updatedAt
    paranoid: true,        // enables soft delete (adds deletedAt)
  }
);

export default Color;
