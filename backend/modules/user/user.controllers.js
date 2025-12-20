import Users from "./user.model.js ";
import Role from "../role/role.model.js";
import { ValidationError, UniqueConstraintError } from "sequelize";

// ✅ Create User
export const createUser = async (req, res) => {
  try {
    const user = await Users.create(req.body);
    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      // Identify which field caused the error
      const field = error.errors[0].path;
      let message = "";

      if (field === "username") message = "Username already exists";
      else if (field === "email") message = "Email already registered";
      else if (field === "phoneNo") message = "Phone number already registered";
      else message = "Duplicate entry";

      return res.status(409).json({ message });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Validation error",
        details: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

// ✅ Update User
export const updateUser = async (req, res) => {
  try {
    const [updated] = await Users.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await Users.findByPk(req.params.id);
    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      const field = error.errors[0].path;
      let message = "";

      if (field === "username") message = "Username already exists";
      else if (field === "email") message = "Email already registered";
      else if (field === "phoneNo") message = "Phone number already registered";
      else message = "Duplicate entry";

      return res.status(409).json({ message });
    }

    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      include: [
        {
          model: Role,
          as: "roleData", // must match association alias
          attributes: ["name"], // only fetch role name
        },
      ],
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      password: user.password,
      user_role: user.user_role,
      rolename: user.roleData?.name || null,
      email: user.email,
      phoneNo: user.phoneNo,
      address: user.address,
      country: user.country,
      state: user.state,
      city: user.city,
      pincode: user.pincode,
      is_active: user.is_active,
      created_by: user.created_by,
      updated_by: user.updated_by,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    }));

    res.status(200).json({ data: formattedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// ✅ Get Single User by ID (with Role Name)
export const getUserById = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id, {
      include: [
        {
          model: Role,
          as: "roleData", // must match association alias
          attributes: ["name"], // fetch only role name
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format user response
    const formattedUser = {
      id: user.id,
      username: user.username,
      user_role: user.user_role,
      rolename: user.roleData?.name || null,
      email: user.email,
      phoneNo: user.phoneNo,
      address: user.address,
      country: user.country,
      state: user.state,
      city: user.city,
      pincode: user.pincode,
      is_active: user.is_active,
      created_by: user.created_by,
      updated_by: user.updated_by,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };

    res.status(200).json({ data: formattedUser });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};
// ✅ Delete User (Soft Delete bcoz paranoid:true)
export const deleteUser = async (req, res) => {
  try {
    const deleted = await Users.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
