import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import styles from "./product.module.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("card"); // "card" or "table"
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getAllProducts();
      const allProducts = res.data || res;
      setProducts(allProducts);
    } catch (err) {
      console.error("❌ Failed to load products:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Products</h2>
        <div className={styles.headerBtn}>
          <button className={styles.addBtn} onClick={() => navigate("/add-product")}>
            ➕ Add Product
          </button>
          <button
            className={styles.toggleBtn}
            onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
          >
            {viewMode === "card" ? "📋 Table View" : "🗂️ Card View"}
          </button>
        </div>
      </div>

      {viewMode === "card" ? (
  
<div className={styles.cardContainer}>
  {products.length === 0 ? (
    <p>No products found.</p>
  ) : (
    products.map((p) => {
      const discount = p.discountPercent || 0;
      const total = (p.price - (p.price * discount) / 100).toFixed(2);

      return (
        <div key={p.id} className={styles.productCard}>
          <div className={styles.productImageBox}>
            {p.images?.length ? (
              <img src={p.images[0].imageUrl} alt={p.name} />
            ) : (
              <div className={styles.noImg}>No Image</div>
            )}
          </div>

          <div className={styles.productContent}>
            <h3 className={styles.productTitle}>{p.name}</h3>

            <p><strong>Category:</strong> {p.category?.category_name || "N/A"}</p>
            <p><strong>Color:</strong> {p.colorData?.color_name || "N/A"}</p>
            <p><strong>Size:</strong> {p.sizeData?.size_name || "N/A"}</p>

            <p><strong>Price:</strong> ₹{p.price}</p>
            <p><strong>Discount:</strong> {discount}%</p>
            <p><strong>Total:</strong> ₹{total}</p>

            <p><strong>Rating:</strong> ⭐ {p.rating || 0}</p>
            <p><strong>Stock:</strong> {p.stock}</p>
          </div>

          <div className={styles.productActions}>
            <FiEdit
              onClick={() => navigate(`/edit-product/${p.id}`)}
            />
            <FiTrash2
              onClick={() => handleDelete(p.id)}
            />
          </div>
        </div>
      );
    })
  )}
</div>

      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Color</th>
              <th>Size</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Total</th>
              <th>Rating</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const discount = p.discountPercent || 0;
              const total = (p.price - (p.price * discount) / 100).toFixed(2);
              return (
                <tr key={p.id}>
                  <td>
                    {p.images?.length ? (
                      <img
                        src={p.images[0].imageUrl}
                        alt={p.name}
                        className={styles.tableImg}
                      />
                    ) : (
                      "No Img"
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category?.category_name || "N/A"}</td>
                  <td>{p.colorData?.color_name || "N/A"}</td>
                  <td>{p.sizeData?.size_name || "N/A"}</td>
                  <td>₹{p.price}</td>
                  <td>{discount}%</td>
                  <td>₹{total}</td>
                  <td>⭐ {p.rating || 0}</td>
                  <td>{p.stock}</td>
                  <td>
                    <FiEdit
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      onClick={() => navigate(`/edit-product/${p.id}`)}
                    />
                    <FiTrash2
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleDelete(p.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;
