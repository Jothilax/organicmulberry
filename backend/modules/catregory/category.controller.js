import Category from "./category.model.js";

// ✅ Create Category
export const createCategory = async (req, res) => {
  try {
    const { category_name, description, is_active } = req.body;

    // Automatically set created_by & updated_by from JWT token
    const category = await Category.create({
      category_name,
      description,
      is_active,
      created_by: req.user.id,  // from decoded JWT
      updated_by: req.user.id,  // same user initially
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating category",
      error: err.message,
    });
  }
};

// ✅ Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};

// ✅ Get Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ category });
  } catch (err) {
    res.status(500).json({ message: "Error fetching category", error: err.message });
  }
};

// ✅ Update Category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.update({
      ...req.body,
      updated_by: req.user.id, // automatically set from token
    });

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating category",
      error: err.message,
    });
  }
};

// ✅ Delete Category (soft delete)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting category",
      error: err.message,
    });
  }
};
