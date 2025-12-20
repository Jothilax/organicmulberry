import Role from "./role.model.js";

// ✅ Create Role (protected)
export const createRole = async (req, res) => {
  try {
    const data = {
      ...req.body,
      created_by: req.user.id,  // from token
      updated_by: req.user.id,
    };

    const role = await Role.create(data);
    res.status(201).json({ message: "Role created successfully", data: role });
  } catch (error) {
    res.status(400).json({ message: "Error creating role", error: error.message });
  }
};

// ✅ Get All Roles (protected)
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({ data: roles });
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles", error: error.message });
  }
};

// ✅ Get Role by ID (protected)
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ data: role });
  } catch (error) {
    res.status(500).json({ message: "Error fetching role", error: error.message });
  }
};

// ✅ Update Role (protected)
export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    await role.update({
      ...req.body,
      updated_by: req.user.id,  // automatically set
    });

    res.status(200).json({ message: "Role updated successfully", data: role });
  } catch (error) {
    res.status(400).json({ message: "Error updating role", error: error.message });
  }
};

// ✅ Delete Role (protected, soft delete)
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    await role.destroy();
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting role", error: error.message });
  }
};
