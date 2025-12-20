import React, { useEffect, useState } from "react";
import styles from "./role.module.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Services
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../services/roleService";

export default function Role() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    role_description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token"); // ✅ Get token

  // ✅ Fetch Roles
  const fetchRoles = async () => {
    try {
      const res = await getAllRoles(token);
      setRoles(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load roles!");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // ✅ Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateRole(
          formData.id,
          {
            name: formData.name,
            role_description: formData.role_description,
          },
          token
        );
        toast.success("Role updated successfully!");
      } else {
        await createRole(
          {
            name: formData.name,
            role_description: formData.role_description,
          },
          token
        );
        toast.success("Role added successfully!");
      }

      fetchRoles();
      setShowModal(false);
      setFormData({ id: "", name: "", role_description: "" });
      setIsEditing(false);
    } catch (err) {
      toast.error("Error saving role!");
      console.error(err);
    }
  };

  // ✅ Edit
  const handleEdit = (role) => {
    setFormData({
      id: role.id,
      name: role.name,
      role_description: role.role_description || "",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRole(id, token);
        fetchRoles();
        toast.info("Role deleted!");
      } catch (err) {
        toast.error("Failed to delete role.");
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} />

      <div className={styles.headerRow}>
        <h2>Roles</h2>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <FaPlus /> Add Role
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Role Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id}>
              <td>{index + 1}</td>
              <td>{role.name}</td>
              <td>{role.role_description || "-"}</td>
              <td>
                <FaEdit
                  className={styles.iconEdit}
                  onClick={() => handleEdit(role)}
                />
                <FaTrash
                  className={styles.iconDelete}
                  onClick={() => handleDelete(role.id)}
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
            <h3>{isEditing ? "Edit Role" : "Add Role"}</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>Role Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <textarea
                name="role_description"
                value={formData.role_description}
                onChange={handleChange}
              ></textarea>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setFormData({ id: "", name: "", role_description: "" });
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
