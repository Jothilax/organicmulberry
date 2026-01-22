import axios from "axios";

const BASE_URL = "http://16.171.20.13:5000/api/colors";

// ✅ Get all colors
export const getAllColors = async (token) => {
  return await axios.get(`${BASE_URL}/getAllColors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Create color
export const createColor = async (data, token) => {
  return await axios.post(`${BASE_URL}/createColor`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Get color by ID
export const getColorById = async (id, token) => {
  return await axios.get(`${BASE_URL}/getColorById/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Update color
export const updateColor = async (id, data, token) => {
  return await axios.put(`${BASE_URL}/updateColor/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Delete color
export const deleteColor = async (id, token) => {
  return await axios.delete(`${BASE_URL}/deleteColor/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
