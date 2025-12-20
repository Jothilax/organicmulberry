import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import bcrypt from "bcrypt";
const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.UUID,            
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },        
    username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
        notEmpty: true,
        // len: [4, 20], // Username length between 4 and 20 characters
    },
    },
    password: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    user_role: {
        type: DataTypes.UUID,
         allowNull: true,
        references: {
            model: 'roles', // name of Target model
            key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    email : {
        type: DataTypes.STRING,
        allowNull: true,        
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    phoneNo : {
        type: DataTypes.STRING,
        allowNull: true,  
        unique: true,
         validate: {
            is: /^[0-9+\-() ]{7,15}$/, // Basic phone number validation
        },
    },
    address : {
        type: DataTypes.STRING,
        allowNull: true,  
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: true,
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
}, {
    tableName: "users",
    timestamps: true, // Adds createdAt and updatedAt fields
    paranoid: true, // Adds deletedAt field for soft deletes
});

// 🔥 Hash password before create/update
Users.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

Users.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});


export default Users;
// Sync the model with the database
// (async () => {
//     await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate the table
//     console.log("Admin table has been created.");
// })();

// Export the model for use in other parts of the application
// export default Admin;
//mysql://root:@localhost:3306/onlineshopping

