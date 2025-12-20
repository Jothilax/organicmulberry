// src/services/product.service.js
const API_BASE = "http://localhost:3000/api/products";
const API_CATBASE = "http://localhost:3000/api/categories";
const API_SIZEBASE = "http://localhost:3000/api/sizes";
const API_COLORBASE = "http://localhost:3000/api/colors";
function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Create product with images
export async function createProduct(data, imageFiles = []) {
  const formData = new FormData();
  
  // Append all product fields to FormData
  Object.keys(data).forEach((key) => {
    const value = data[key];
    
    // Handle boolean values explicitly (is_active)
    if (key === "is_active") {
      // Always send is_active, even if false
      const boolValue = value === true || value === "true" || value === true;
      formData.append(key, boolValue ? "true" : "false");
    } else if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });
  
  // Append image files
  if (imageFiles && imageFiles.length > 0) {
    Array.from(imageFiles).forEach((file) => {
      formData.append("images", file);
    });
  }
  
  // Append alt_texts if provided
  // Multer parses multiple values with same key as array
  if (data.alt_texts && Array.isArray(data.alt_texts)) {
    data.alt_texts.forEach((altText) => {
      formData.append("alt_texts", altText);
    });
  }
  
  const res = await fetch(`${API_BASE}/createProduct`, {
    method: "POST",
    headers: {
      ...authHeaders(), // Don't set Content-Type, let browser set it with boundary
    },
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: `Create failed: ${res.status}` }));
    throw new Error(errorData.message || `Create failed: ${res.status}`);
  }
  return res.json();
}

// Update product with optional images
export async function updateProduct(productId, data, imageFiles = [], options = {}) {
  const formData = new FormData();
  
  // Append all product fields to FormData
  Object.keys(data).forEach((key) => {
    // Skip image-related fields that are handled separately
    if (key !== "images" && key !== "alt_texts" && key !== "image_ids_to_delete") {
      const value = data[key];
      
      // Handle boolean values explicitly (is_active)
      if (key === "is_active") {
        // Always send is_active, even if false
        // Convert boolean or string "true"/"false" to string
        const boolValue = value === true || value === "true" || String(value).toLowerCase() === "true";
        formData.append(key, boolValue ? "true" : "false");
      } else if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    }
  });
  
  // Handle replace_images flag
  if (options.replaceImages !== undefined) {
    formData.append("replace_images", options.replaceImages);
  }
  
  // Append new image files
  if (imageFiles && imageFiles.length > 0) {
    Array.from(imageFiles).forEach((file) => {
      formData.append("images", file);
    });
  }
  
  // Append alt_texts if provided
  // Multer parses multiple values with same key as array
  if (data.alt_texts && Array.isArray(data.alt_texts)) {
    data.alt_texts.forEach((altText) => {
      formData.append("alt_texts", altText);
    });
  }
  
  // Handle image deletion - backend expects array format
  // When same key is appended multiple times, Express parses as array
  if (options.imageIdsToDelete && Array.isArray(options.imageIdsToDelete) && options.imageIdsToDelete.length > 0) {
    options.imageIdsToDelete.forEach((imageId) => {
      formData.append("image_ids_to_delete", imageId);
    });
  }
  
  const res = await fetch(`${API_BASE}/updateProduct/${productId}`, {
    method: "PUT",
    headers: {
      ...authHeaders(), // Don't set Content-Type, let browser set it with boundary
    },
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: `Update failed: ${res.status}` }));
    throw new Error(errorData.message || `Update failed: ${res.status}`);
  }
  return res.json();
}

// Get all products
export async function getAllProducts() {
  const res = await fetch(`${API_BASE}/getAllProducts`, {
    method: "GET",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

// Get product by id
export async function getProductById(id) {
  const res = await fetch(`${API_BASE}/getProductById/${id}`, {
    method: "GET",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Fetch product failed: ${res.status}`);
  return res.json();
}

// Delete product
export async function deleteProduct(productId) {
  const res = await fetch(`${API_BASE}/deleteProduct/${productId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}

// Delete product image
export async function deleteProductImage(imageId) {
  const res = await fetch(`${API_BASE}/deleteProductImage/${imageId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Delete image failed: ${res.status}`);
  return res.json();
}


// http://localhost:3000/api/categories/getAllCategories

export async function getAllCategories() {
  const res = await fetch(`${API_CATBASE}/getAllCategories`, {
    method: "GET",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Fetch categories failed: ${res.status}`);
  return res.json();
}



// http://localhost:3000/api/sizes/getAllSizes

export async function getAllSizes() {
  const res = await fetch(`${API_SIZEBASE}/getAllSizes`, {
    method: "GET",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Fetch sizes failed: ${res.status}`);
  return res.json();
}

// http://localhost:3000/api/colors/getAllColors

export async function getAllColors() {
  const res = await fetch(`${API_COLORBASE}/getAllColors`, {
    method: "GET",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Fetch colors failed: ${res.status}`);
  return res.json();
}

// // ✅ Get all categories
// export const getAllCategories = async (token) => {
//   return await axios.get(`${API_CATBASE}/getAllCategories`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };