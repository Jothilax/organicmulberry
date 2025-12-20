// modules/size/size.model.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Size = sequelize.define("Size", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  size_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  size_description: {
    type: DataTypes.STRING,
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
  tableName: "sizes",
  timestamps: true,
  paranoid: true,
});

export default Size;
