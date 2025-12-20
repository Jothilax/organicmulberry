// src/services/categoryService.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/categories";

// ✅ Get all categories
export const getAllCategories = async (token) => {
  return await axios.get(`${BASE_URL}/getAllCategories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Create new category
export const createCategory = async (data, token) => {
  return await axios.post(`${BASE_URL}/createCategory`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Update category
export const updateCategory = async (id, data, token) => {
  return await axios.put(`${BASE_URL}/updateCategory/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Delete category
export const deleteCategory = async (id, token) => {
  return await axios.delete(`${BASE_URL}/deleteCategory/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
