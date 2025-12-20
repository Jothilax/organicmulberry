import React, { useEffect, useState } from "react";
import styles from "./coupon.module.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../services/couponService";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    min_purchase: "",
    max_discount: "",
    expiry_date: "",
    usage_limit: "",
    is_active: true,
  });
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch coupons
  const fetchCoupons = async () => {
    try {
      const res = await getAllCoupons();
      setCoupons(res.coupons || []);
    } catch (err) {
      toast.error("Failed to load coupons.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCoupon(formData.id, formData);
        toast.success("Coupon updated successfully!");
      } else {
        await createCoupon(formData);
        toast.success("Coupon added successfully!");
      }

      fetchCoupons();
      setShowModal(false);
      setFormData({
        id: "",
        code: "",
        description: "",
        discount_type: "percentage",
        discount_value: "",
        min_purchase: "",
        max_discount: "",
        expiry_date: "",
        usage_limit: "",
        is_active: true,
      });
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving coupon!");
      console.error(err);
    }
  };

  // ✅ Edit
  const handleEdit = (coupon) => {
    setFormData({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description || "",
      discount_type: coupon.discount_type || "percentage",
      discount_value: coupon.discount_value || "",
      min_purchase: coupon.min_purchase || "",
      max_discount: coupon.max_discount || "",
      expiry_date: coupon.expiry_date
        ? new Date(coupon.expiry_date).toISOString().split("T")[0]
        : "",
      usage_limit: coupon.usage_limit || "",
      is_active: coupon.is_active !== undefined ? coupon.is_active : true,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id);
        fetchCoupons();
        toast.info("Coupon deleted!");
      } catch (err) {
        toast.error("Failed to delete coupon.");
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} />
      <div className={styles.headerRow}>
        <h2>Coupons</h2>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <FaPlus /> Add Coupon
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Code</th>
            <th>Description</th>
            <th>Discount Type</th>
            <th>Discount Value</th>
            <th>Min Purchase</th>
            <th>Max Discount</th>
            <th>Expiry Date</th>
            <th>Usage Limit</th>
            <th>Used</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon, index) => (
            <tr key={coupon.id}>
              <td>{index + 1}</td>
              <td><strong>{coupon.code}</strong></td>
              <td>{coupon.description || "-"}</td>
              <td>
                <span className={styles.badge} data-type={coupon.discount_type}>
                  {coupon.discount_type}
                </span>
              </td>
              <td>
                {coupon.discount_type === "percentage"
                  ? `${coupon.discount_value}%`
                  : `₹${coupon.discount_value}`}
              </td>
              <td>{coupon.min_purchase ? `₹${coupon.min_purchase}` : "-"}</td>
              <td>{coupon.max_discount ? `₹${coupon.max_discount}` : "-"}</td>
              <td>
                {coupon.expiry_date
                  ? new Date(coupon.expiry_date).toLocaleDateString()
                  : "No expiry"}
              </td>
              <td>{coupon.usage_limit || "Unlimited"}</td>
              <td>{coupon.used_count || 0}</td>
              <td>
                <span
                  className={styles.status}
                  data-status={coupon.is_active ? "active" : "inactive"}
                >
                  {coupon.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <FaEdit
                  className={styles.iconEdit}
                  onClick={() => handleEdit(coupon)}
                />
                <FaTrash
                  className={styles.iconDelete}
                  onClick={() => handleDelete(coupon.id)}
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
            <h3>{isEditing ? "Edit Coupon" : "Add Coupon"}</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="e.g., SAVE20"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Coupon description"
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label>Discount Type *</label>
                <select
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleChange}
                  required
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Discount Value *</label>
                <input
                  type="number"
                  name="discount_value"
                  value={formData.discount_value}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder={formData.discount_type === "percentage" ? "e.g., 20" : "e.g., 100"}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Minimum Purchase</label>
                <input
                  type="number"
                  name="min_purchase"
                  value={formData.min_purchase}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Max Discount (for percentage)</label>
                <input
                  type="number"
                  name="max_discount"
                  value={formData.max_discount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Optional"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Usage Limit</label>
                <input
                  type="number"
                  name="usage_limit"
                  value={formData.usage_limit}
                  onChange={handleChange}
                  min="0"
                  placeholder="Unlimited if empty"
                />
              </div>

              <div className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <label>Active</label>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setFormData({
                      id: "",
                      code: "",
                      description: "",
                      discount_type: "percentage",
                      discount_value: "",
                      min_purchase: "",
                      max_discount: "",
                      expiry_date: "",
                      usage_limit: "",
                      is_active: true,
                    });
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

