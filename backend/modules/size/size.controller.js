// modules/size/size.controllers.js
import Size from "./size.model.js";

// // ✅ Create Size
// export const createSize = async (req, res) => {
//   try {
//     const size = await Size.create(req.body);
//     res.status(201).json({ message: "Size created successfully", size });
//   } catch (err) {
//     res.status(500).json({ message: "Error creating size", error: err.message });
//   }
// };

// ✅ Create Size
export const createSize = async (req, res) => {
  try {
    const userId = req.user?.id; // 👈 Extract user id from token
    if (!userId) return res.status(401).json({ message: "User not authorized" });

    const size = await Size.create({
      ...req.body,
      created_by: userId,
      updated_by: userId,
    });

    res.status(201).json({ message: "Size created successfully", size });
  } catch (err) {
    res.status(500).json({ message: "Error creating size", error: err.message });
  }
};

// ✅ Update Size
export const updateSize = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "User not authorized" });

    const size = await Size.findByPk(req.params.id);
    if (!size) return res.status(404).json({ message: "Size not found" });

    await size.update({
      ...req.body,
      updated_by: userId,
    });

    res.json({ message: "Size updated successfully", size });
  } catch (err) {
    res.status(500).json({ message: "Error updating size", error: err.message });
  }
};


// ✅ Get All Sizes
export const getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.findAll();
    res.json({ sizes });
  } catch (err) {
    res.status(500).json({ message: "Error fetching sizes", error: err.message });
  }
};

// ✅ Get Size by ID
export const getSizeById = async (req, res) => {
  try {
    const size = await Size.findByPk(req.params.id);
    if (!size) return res.status(404).json({ message: "Size not found" });
    res.json({ size });
  } catch (err) {
    res.status(500).json({ message: "Error fetching size", error: err.message });
  }
};

// ✅ Update Size
// export const updateSize = async (req, res) => {
//   try {
//     const size = await Size.findByPk(req.params.id);
//     if (!size) return res.status(404).json({ message: "Size not found" });

//     await size.update(req.body);
//     res.json({ message: "Size updated successfully", size });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating size", error: err.message });
//   }
// };

// ✅ Delete Size (soft delete)
export const deleteSize = async (req, res) => {
  try {
    const size = await Size.findByPk(req.params.id);
    if (!size) return res.status(404).json({ message: "Size not found" });

    await size.destroy();
    res.json({ message: "Size deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting size", error: err.message });
  }
};
