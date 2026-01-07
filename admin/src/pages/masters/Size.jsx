// import React, { useEffect, useState } from "react";
// import styles from "./size.module.css";
// import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // 🧩 Import services
// import {
//   getAllSizes,
//   createSize,
//   updateSize,
//   deleteSize,
// } from "../../services/sizeService";

// export default function Size() {
//   const [sizes, setSizes] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({ id: "", size_name: "", size_description: "" });
//   const [isEditing, setIsEditing] = useState(false);

//   const token = localStorage.getItem("token");

//   // ✅ Fetch sizes
//   const fetchSizes = async () => {
//     try {
//       const res = await getAllSizes(token);
//       setSizes(res.data.sizes || []); // adjust based on backend response
//     } catch (err) {
//       toast.error("Failed to load sizes.");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchSizes();
//   }, []);

//   // ✅ Handle input
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Add or Update
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isEditing) {
//         await updateSize(
//           formData.id,
//           { size_name: formData.size_name, size_description: formData.size_description },
//           token
//         );
//         toast.success("Size updated successfully!");
//       } else {
//         await createSize(
//           { size_name: formData.size_name, size_description: formData.size_description },
//           token
//         );
//         toast.success("Size added successfully!");
//       }

//       fetchSizes();
//       setShowModal(false);
//       setFormData({ id: "", size_name: "", size_description: "" });
//       setIsEditing(false);
//     } catch (err) {
//       toast.error("Error saving size!");
//       console.error(err);
//     }
//   };

//   // ✅ Edit
//   const handleEdit = (sz) => {
//     setFormData({
//       id: sz.id,
//       size_name: sz.size_name,
//       size_description: sz.size_description || "",
//     });
//     setIsEditing(true);
//     setShowModal(true);
//   };

//   // ✅ Delete
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this size?")) {
//       try {
//         await deleteSize(id, token);
//         fetchSizes();
//         toast.info("Size deleted!");
//       } catch (err) {
//         toast.error("Failed to delete size.");
//         console.error(err);
//       }
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <ToastContainer position="top-right" autoClose={2500} />
//       <div className={styles.headerRow}>
//         <h2>Sizes</h2>
//         <button className={styles.addBtn} onClick={() => setShowModal(true)}>
//           <FaPlus /> Add Size
//         </button>
//       </div>

//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Size Name</th>
//             <th>Description</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sizes.map((sz, index) => (
//             <tr key={sz.id}>
//               <td>{index + 1}</td>
//               <td>{sz.size_name}</td>
//               <td>{sz.size_description || "-"}</td>
//               <td>
//                 <FaEdit className={styles.iconEdit} onClick={() => handleEdit(sz)} />
//                 <FaTrash className={styles.iconDelete} onClick={() => handleDelete(sz.id)} />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal */}
//       {showModal && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modal}>
//             <h3>{isEditing ? "Edit Size" : "Add Size"}</h3>
//             <form onSubmit={handleSubmit} className={styles.form}>
//               <label>Size Name</label>
//               <input
//                 type="text"
//                 name="size_name"
//                 value={formData.size_name}
//                 onChange={handleChange}
//                 required
//               />

//               <label>Description</label>
//               <textarea
//                 name="size_description"
//                 value={formData.size_description}
//                 onChange={handleChange}
//               ></textarea>

//               <div className={styles.modalActions}>
//                 <button
//                   type="button"
//                   className={styles.cancelBtn}
//                   onClick={() => {
//                     setShowModal(false);
//                     setIsEditing(false);
//                     setFormData({ id: "", size_name: "", size_description: "" });
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className={styles.saveBtn}>
//                   {isEditing ? "Update" : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import styles from "./size.module.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🧩 Services
import {
  getAllSizes,
  createSize,
  updateSize,
  deleteSize,
} from "../../services/sizeService";

export default function Size() {
  const [sizes, setSizes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    size_name: "",
    size_description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch sizes
  const fetchSizes = async () => {
    try {
      const res = await getAllSizes(token);
      setSizes(res.data.sizes || []);
    } catch (err) {
      toast.error("Failed to load sizes");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  // ✅ Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateSize(
          formData.id,
          {
            size_name: formData.size_name,
            size_description: formData.size_description,
          },
          token
        );
        toast.success("Size updated successfully!");
      } else {
        await createSize(
          {
            size_name: formData.size_name,
            size_description: formData.size_description,
          },
          token
        );
        toast.success("Size added successfully!");
      }

      fetchSizes();
      setShowModal(false);
      setIsEditing(false);
      setFormData({ id: "", size_name: "", size_description: "" });
    } catch (err) {
      toast.error("Error saving size");
      console.error(err);
    }
  };

  // ✅ Edit
  const handleEdit = (sz) => {
    setFormData({
      id: sz.id,
      size_name: sz.size_name,
      size_description: sz.size_description || "",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this size?")) {
      try {
        await deleteSize(id, token);
        fetchSizes();
        toast.info("Size deleted");
      } catch (err) {
        toast.error("Failed to delete size");
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} />

      <div className={styles.headerRow}>
        <h2>Sizes</h2>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <FaPlus /> Add Size
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Size Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((sz, index) => (
            <tr key={sz.id}>
              <td>{index + 1}</td>
              <td>{sz.size_name}</td>
              <td>{sz.size_description || "-"}</td>
              <td>
                <FaEdit
                  className={styles.iconEdit}
                  onClick={() => handleEdit(sz)}
                />
                <FaTrash
                  className={styles.iconDelete}
                  onClick={() => handleDelete(sz.id)}
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
            <h3>{isEditing ? "Edit Size" : "Add Size"}</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>Size Name</label>
              <input
                type="text"
                name="size_name"
                value={formData.size_name}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <textarea
                name="size_description"
                value={formData.size_description}
                onChange={handleChange}
              />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setFormData({
                      id: "",
                      size_name: "",
                      size_description: "",
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
