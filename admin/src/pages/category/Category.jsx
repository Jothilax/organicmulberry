import React, { useEffect, useState } from "react";
import styles from "./category.module.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🧩 Import services
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: "", category_name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories(token);
      setCategories(res.data.categories || []);
    } catch (err) {
      toast.error("Failed to load categories.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCategory(
          formData.id,
          { category_name: formData.category_name, description: formData.description },
          token
        );
        toast.success("Category updated successfully!");
      } else {
        await createCategory(
          { category_name: formData.category_name, description: formData.description },
          token
        );
        toast.success("Category added successfully!");
      }

      fetchCategories();
      setShowModal(false);
      setFormData({ id: "", category_name: "", description: "" });
      setIsEditing(false);
    } catch (err) {
      toast.error("Error saving category!");
      console.error(err);
    }
  };

  // ✅ Edit
  const handleEdit = (cat) => {
    setFormData({
      id: cat.id,
      category_name: cat.category_name,
      description: cat.description || "",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id, token);
        fetchCategories();
        toast.info("Category deleted!");
      } catch (err) {
        toast.error("Failed to delete category.");
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} />
      <div className={styles.headerRow}>
        <h2>Categories</h2>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <FaPlus /> Add Category
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr key={cat.id}>
              <td>{index + 1}</td>
              <td>{cat.category_name}</td>
              <td>{cat.description || "-"}</td>
              <td>
                <FaEdit className={styles.iconEdit} onClick={() => handleEdit(cat)} />
                <FaTrash className={styles.iconDelete} onClick={() => handleDelete(cat.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{isEditing ? "Edit Category" : "Add Category"}</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>Category Name</label>
              <input
                type="text"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setFormData({ id: "", category_name: "", description: "" });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
