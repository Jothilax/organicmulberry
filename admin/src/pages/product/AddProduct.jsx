import React, { useState, useEffect } from "react";
import { createProduct, getAllCategories, getAllSizes, getAllColors } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import styles from "./AddProduct.module.css";

const AddProduct = () => {
  const [form, setForm] = useState({
    category_id: "",
    brand: "",
    name: "",
    color: "",
    pattern: "",
    style: "",
    material: "",
    threadCount: "",
    size: "",
    dimensions: "",
    pocketDepth: "",
    weight: "",
    countryOfOrigin: "",
    price: "",
    mrp: "",
    discountPercent: "",
    description: "",
    includedComponents: "",
    rating: "",
    reviewsCount: "",
    link: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadSizes();
    loadColors();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res?.categories || res || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const loadSizes = async () => {
    try {
      const res = await getAllSizes();
      setSizes(res?.sizes || res || []);
    } catch (err) {
      console.error("Failed to load sizes", err);
    }
  };

  const loadColors = async () => {
    try {
      const res = await getAllColors();
      setColors(res?.colors || res?.data || res || []);
    } catch (err) {
      console.error("Failed to load colors", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProduct(form, images);
      alert("Product added successfully");
      navigate("/products");
    } catch (err) {
      alert("Failed to add product");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <span>📋</span>
        <h2>Add Product</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        
        {/* Row 1 */}
        <div className={styles.col1}>
          <label>Category</label>
          <select name="category_id" value={form.category_id} onChange={handleChange}>
            <option value="">Select</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.category_name}</option>
            ))}
          </select>
        </div>

        <div className={styles.col1}>
          <label>Brand</label>
          <input name="brand" value={form.brand} onChange={handleChange} />
        </div>

        <div className={styles.col1}>
          <label>Product Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        {/* Row 2 */}
        <div className={styles.col1}>
          <label>Color</label>
          <select name="color" value={form.color} onChange={handleChange}>
            <option value="">Select</option>
            {colors.map((c) => (
              <option key={c.color_id} value={c.color_id}>{c.color_name}</option>
            ))}
          </select>
        </div>

        <div className={styles.col1}>
          <label>Pattern</label>
          <input name="pattern" value={form.pattern} onChange={handleChange} />
        </div>

        <div className={styles.col1}>
          <label>Style</label>
          <input name="style" value={form.style} onChange={handleChange} />
        </div>

        {/* Row 3 */}
        <div className={styles.col1}>
          <label>Material</label>
          <input name="material" value={form.material} onChange={handleChange} />
        </div>

        <div className={styles.col1}>
          <label>Thread Count</label>
          <input name="threadCount" value={form.threadCount} onChange={handleChange} />
        </div>

        <div className={styles.col1}>
          <label>Size</label>
          <select name="size" value={form.size} onChange={handleChange}>
            <option value="">Select</option>
            {sizes.map((s) => (
              <option key={s.id} value={s.id}>{s.size_name}</option>
            ))}
          </select>
        </div>

    

        {/* Row - dimensions */}
        <div className={styles.col1}>
          <label>Dimensions</label>
          <input name="dimensions" value={form.dimensions} onChange={handleChange} />
        </div>

        <div className={styles.col1}>
          <label>Pocket Depth</label>
          <input name="pocketDepth" value={form.pocketDepth} onChange={handleChange} />
        </div>

        <div className={styles.col1}>
          <label>Weight</label>
          <input name="weight" value={form.weight} onChange={handleChange} />
        </div>

        {/* Price */}
        <div className={styles.col1}>
          <label>Price</label>
          <input name="price" value={form.price} onChange={handleChange} />
        </div>

        <div className={styles.col1}>
          <label>MRP</label>
          <input name="mrp" value={form.mrp} onChange={handleChange} />
        </div>

        <div className={styles.col1}>
          <label>Discount (%)</label>
          <input name="discountPercent" value={form.discountPercent} onChange={handleChange} />
        </div>

        {/* --- Additional Info --- */}
        <div className={styles.formGroup}>
          <label>Country of Origin</label>
          <input name="countryOfOrigin" value={form.countryOfOrigin || ""} onChange={handleChange} placeholder="Country of Origin" />
        </div>

        <div className={styles.formGroup}>
          <label>Included Components</label>
          <input name="includedComponents" value={form.includedComponents || ""} onChange={handleChange} placeholder="Included Components" />
        </div>

        <div className={styles.formGroup}>
          <label>Product Link</label>
          <input name="link" value={form.link || ""} onChange={handleChange} placeholder="Product Link" />
        </div>

        {/* --- Ratings & Stock --- */}
        <div className={styles.formGroup}>
          <label>Rating</label>
          <input name="rating" type="number" step="0.1" value={form.rating || ""} onChange={handleChange} placeholder="Rating" />
        </div>

        <div className={styles.formGroup}>
          <label>Reviews Count</label>
          <input name="reviewsCount" type="number" value={form.reviewsCount || ""} onChange={handleChange} placeholder="Reviews Count" />
        </div>

        <div className={styles.formGroup}>
          <label>Stock</label>
          <input name="stock" type="number" value={form.stock || ""} onChange={handleChange} placeholder="Stock" />
        </div>

        {/* Description (Full Width) */}
        <div className={styles.col3}>
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </div>

        {/* Images */}
        <div className={styles.col3}>
          <label>Upload Images</label>
          <input type="file" multiple onChange={handleImageChange} />

          {imagePreviews.length > 0 && (
            <div className={styles.imagePreviewContainer}>
              {imagePreviews.map((img, i) => (
                <div key={i} className={styles.imageBox}>
                  <img src={img} />
                  <button type="button" onClick={() => removeImage(i)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className={styles.buttonRow}>
            <button className={styles.submitBtn} disabled={loading}>
          {loading ? "Saving..." : "Add Product"}
        </button>
        </div>
       
      </form>
    </div>
  );
};

export default AddProduct;
