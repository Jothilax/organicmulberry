// src/shared/seed.js
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";
import User from "../modules/user/user.model.js";
import Role from "../modules/role/role.model.js";

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // 🔹 Sync database schema (optional — safe in dev)
    await sequelize.sync({ alter: false });

    // 🔹 Check if the Super Admin role exists
    let superAdminRole = await Role.findOne({ where: { name: "Super Admin" } });

    if (!superAdminRole) {
      console.log("🛠️  Creating 'Super Admin' role...");
      superAdminRole = await Role.create({
        name: "Super Admin",
        role_description: "Has full access to all system modules.",
        created_by: null,
      });
      console.log("✅ Role 'Super Admin' created successfully!");
    } else {
      console.log("ℹ️  'Super Admin' role already exists.");
    }

    // 🔹 Check if an admin user already exists
    const existingUser = await User.findOne({ where: { username: "Jothilakshmi" } });

    if (!existingUser) {
      console.log("👤 Creating Super Admin user...");

       const adminUser = await User.create({
        username: "Jothilakshmi",
        password: "admin123",
        user_role: superAdminRole.id,
        email: "jothilakshmi2162000@gmail.com",
        phoneNo: "6383061117",
        address: "Head Office, Coimbatore",
        country: "India",
        state: "Tamil Nadu",
        city: "Coimbatore",
        pincode: "641048",
        created_by: null,
      });

      console.log("✅ Super Admin user created successfully!");
      console.log("📋 Login credentials:");
      console.log("   Username: Jothilakshmi");
      console.log("   Password: admin123");
      console.log("   Role ID:", superAdminRole.id);
      console.log("   User ID:", adminUser.id);
    } else {
      console.log("ℹ️  Admin user 'Jothilakshmi' already exists. Skipping creation.");
    }

    console.log("🎉 Database seed completed successfully!");
  } catch (err) {
    console.error("❌ Error during seeding:", err.message);
    console.error(err.stack);
  } finally {
    // await sequelize.close();
  }
}

// If you want to run it directly with: `node src/shared/seed.js`
if (process.argv[1].includes("seed.js")) {
  seedDatabase();
}
