import React, { useEffect, useState } from "react";
import styles from "./color.module.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🧩 Import services
import {
  getAllColors,
  createColor,
  updateColor,
  deleteColor,
} from "../../services/colourService.js";

export default function Color() {
  const [colors, setColors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    color_id: "",
    color_name: "",
    color_code: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch colors
  const fetchColors = async () => {
    try {
      const res = await getAllColors(token);
      setColors(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load colors.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    if (!hexRegex.test(formData.color_code)) {
      toast.error("Please enter a valid hex color code (e.g. #fff or #ffffff)");
      return;
    }

    try {
      if (isEditing) {
        await updateColor(
          formData.color_id,
          {
            color_name: formData.color_name,
            color_code: formData.color_code,
          },
          token
        );
        toast.success("Color updated successfully!");
      } else {
        await createColor(
          {
            color_name: formData.color_name,
            color_code: formData.color_code,
          },
          token
        );
        toast.success("Color added successfully!");
      }

      fetchColors();
      setShowModal(false);
      setFormData({ color_id: "", color_name: "", color_code: "" });
      setIsEditing(false);
    } catch (err) {
      toast.error("Error saving color!");
      console.error(err);
    }
  };

  // ✅ Edit
  const handleEdit = (col) => {
    if (!col || !col.color_id) {
      toast.error("Invalid color data.");
      return;
    }

    setFormData({
      color_id: col.color_id,
      color_name: col.color_name || "",
      color_code: col.color_code || "",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // ✅ Delete
  const handleDelete = async (color_id) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        await deleteColor(color_id, token);
        fetchColors();
        toast.info("Color deleted!");
      } catch (err) {
        toast.error("Failed to delete color.");
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} />
      <div className={styles.headerRow}>
        <h2>Colors</h2>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <FaPlus /> Add Color
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Color Name</th>
            <th>Color Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((col, index) => (
            <tr key={col.color_id}>
              <td>{index + 1}</td>
              <td>{col.color_name}</td>
              <td>
                <span
                  className={styles.colorPreview}
                  style={{ backgroundColor: col.color_code }}
                ></span>{" "}
                {col.color_code || "-"}
              </td>
              <td>
                <FaEdit
                  className={styles.iconEdit}
                  onClick={() => handleEdit(col)}
                />
                <FaTrash
                  className={styles.iconDelete}
                  onClick={() => handleDelete(col.color_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{isEditing ? "Edit Color" : "Add Color"}</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>Color Name</label>
              <input
                type="text"
                name="color_name"
                value={formData.color_name}
                onChange={handleChange}
                required
              />

              <label>Color Code</label>
              <input
                type="text"
                name="color_code"
                value={formData.color_code}
                onChange={handleChange}
                placeholder="#FFFFFF"
                required
              />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setFormData({ color_id: "", color_name: "", color_code: "" });
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
