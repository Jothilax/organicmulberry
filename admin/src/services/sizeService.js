import axios from "axios";

const BASE_URL = "https://organicmulberry.onrender.com/api/sizes";

// ✅ Get all sizes
export const getAllSizes = async (token) => {
  return await axios.get(`${BASE_URL}/getAllSizes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Create size
export const createSize = async (data, token) => {
  return await axios.post(`${BASE_URL}/createSize`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Get size by ID
export const getSizeById = async (id, token) => {
  return await axios.get(`${BASE_URL}/getSizeById/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Update size
export const updateSize = async (id, data, token) => {
  return await axios.put(`${BASE_URL}/updateSize/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Delete size
export const deleteSize = async (id, token) => {
  return await axios.delete(`${BASE_URL}/deleteSize/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
