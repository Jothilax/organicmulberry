import React, { useEffect, useState } from "react";
import styles from "./user.module.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userService.js";
import { getAllRoles } from "../../services/roleService.js";

export default function User() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    password: "",
    user_role: "",
    email: "",
    phoneNo: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  });

  const token = localStorage.getItem("token");

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers(token);
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load users!");
      console.error(err);
    }
  };

  // ✅ Fetch all roles
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
    fetchUsers();
    fetchRoles();
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username: formData.username,
        ...(isEditing ? {} : { password: formData.password }), // only include password on create
        user_role: formData.user_role, // This will be the UUID now
        email: formData.email,
        phoneNo: formData.phoneNo,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
      };

      if (isEditing) {
        await updateUser(formData.id, payload, token);
        toast.success("User updated successfully!");
      } else {
        await createUser(payload, token);
        toast.success("User added successfully!");
      }

      fetchUsers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      // const msg = err.response?.data?.message || "Error saving user!";
      // toast.error(msg);
      // console.error("❌ API Error:", err.response?.data || err.message);

      // 💥 Handle backend validation message
      const msg = error.response.data.message;

      // You can either show it as toast
      toast.error(msg);

      // OR show inline error if you have per-field validation
      // Example: setFieldError("email", msg);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      username: "",
      password: "",
      user_role: "",
      email: "",
      phoneNo: "",
      address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    });
    setIsEditing(false);
  };

  // ✅ Edit user
  const handleEdit = (usr) => {
    setFormData({
      id: usr.id,
      username: usr.username || "",
      password: "",
      user_role:
        typeof usr.user_role === "object"
          ? usr.user_role.role_id
          : usr.user_role || "",
      email: usr.email || "",
      phoneNo: usr.phoneNo || "",
      address: usr.address || "",
      country: usr.country || "",
      state: usr.state || "",
      city: usr.city || "",
      pincode: usr.pincode || "",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // ✅ Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id, token);
        fetchUsers();
        toast.info("User deleted!");
      } catch (err) {
        toast.error("Failed to delete user!");
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} />

      <div className={styles.headerRow}>
        <h2>Users</h2>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <FaPlus /> Add User
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((usr, index) => (
            <tr key={usr.id}>
              <td>{index + 1}</td>
              <td>{usr.username}</td>
              <td>{usr.email}</td>
              <td>{usr.phoneNo}</td>
              <td>
                {usr.rolename ||
                  roles.find((r) => r.role_id === usr.user_role)?.name ||
                  usr.user_role}
              </td>
              <td>{usr.city}</td>
              <td>
                <FaEdit
                  className={styles.iconEdit}
                  onClick={() => handleEdit(usr)}
                />
                <FaTrash
                  className={styles.iconDelete}
                  onClick={() => handleDelete(usr.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{isEditing ? "Edit User" : "Add User"}</h3>

            <form onSubmit={handleSubmit} className={styles.gridForm}>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isEditing && (
                <div>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Phone</label>
                <input
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Role</label>
                <select
                  name="user_role"
                  value={formData.user_role}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Role --</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
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
