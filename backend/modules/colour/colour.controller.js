// import Color from "./colour.model.js";

// // ➕ Create Color
// export const createColor = async (req, res) => {
//   try {
//     const color = await Color.create(req.body);
//     return res.status(201).json({ message: "Color created", data: color });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // 📜 Get All Colors
// export const getAllColors = async (req, res) => {
//   try {
//     const colors = await Color.findAll();
//     return res.json({ data: colors });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // 🔍 Get Color by ID
// export const getColorById = async (req, res) => {
//   try {
//     const color = await Color.findByPk(req.params.id);
//     if (!color) return res.status(404).json({ message: "Color not found" });
//     return res.json({ data: color });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ✏️ Update Color
// export const updateColor = async (req, res) => {
//   try {
//     const color = await Color.findByPk(req.params.id);
//     if (!color) return res.status(404).json({ message: "Color not found" });

//     await color.update(req.body);
//     return res.json({ message: "Color updated", data: color });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ❌ Delete Color
// export const deleteColor = async (req, res) => {
//   try {
//     const color = await Color.findByPk(req.params.id);
//     if (!color) return res.status(404).json({ message: "Color not found" });

//     await color.destroy();
//     return res.json({ message: "Color deleted" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


import Color from "./colour.model.js";

// ➕ Create Color
export const createColor = async (req, res) => {
  try {
    const { color_name, color_code, is_active } = req.body;

    const color = await Color.create({
      color_name,
      color_code,
      is_active,
      created_by: req.user.id,  // ✅ from decoded JWT
      updated_by: req.user.id,  // ✅ same user initially
    });

    return res.status(201).json({
      message: "Color created successfully",
      data: color,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error creating color",
      error: err.message,
    });
  }
};

// 📜 Get All Colors
export const getAllColors = async (req, res) => {
  try {
    const colors = await Color.findAll();
    return res.json({ data: colors });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching colors" });
  }
};

// 🔍 Get Color by ID
export const getColorById = async (req, res) => {
  try {
    const color = await Color.findByPk(req.params.id);
    if (!color) return res.status(404).json({ message: "Color not found" });
    return res.json({ data: color });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching color" });
  }
};

// ✏️ Update Color
export const updateColor = async (req, res) => {
  try {
    const color = await Color.findByPk(req.params.id);
    if (!color) return res.status(404).json({ message: "Color not found" });

    await color.update({
      ...req.body,
      updated_by: req.user.id, // ✅ automatically updated from token
    });

    return res.json({
      message: "Color updated successfully",
      data: color,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error updating color",
      error: err.message,
    });
  }
};

// ❌ Delete Color (soft delete)
export const deleteColor = async (req, res) => {
  try {
    const color = await Color.findByPk(req.params.id);
    if (!color) return res.status(404).json({ message: "Color not found" });

    await color.destroy();
    return res.json({ message: "Color deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error deleting color",
      error: err.message,
    });
  }
};
