import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Company = sequelize.define("Company", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  website: {
    type: DataTypes.STRING,
  },
  certificationFile: {
    type: DataTypes.STRING, // stores file path
  },
  certificationType: {
    type: DataTypes.STRING, // e.g., PCI-DSS, ISO, etc.
  },
  is_active : {
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
},{
tableName: "company",   // 👈 table name override
    timestamps: true,      // adds createdAt & updatedAt
});

export default Company;
