import axios from "axios";

const BASE_URL = "https://organicmulberry.onrender.com/api/roles";

// ✅ Get all roles
export const getAllRoles = async (token) => {
  return await axios.get(`${BASE_URL}/getAllRoles`, {
    headers: { Authorization: `Bearer ${token}` },withCredentials: true,
  });
};

// ✅ Create role
export const createRole = async (data, token) => {
  return await axios.post(`${BASE_URL}/createRole`, data, {
    headers: { Authorization: `Bearer ${token}` },withCredentials: true,
  });
};

// ✅ Update role
export const updateRole = async (id, data, token) => {
  return await axios.put(`${BASE_URL}/updateRole/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },withCredentials: true,
  });
};

// ✅ Delete role
export const deleteRole = async (id, token) => {
  return await axios.delete(`${BASE_URL}/deleteRole/${id}`, {
    headers: { Authorization: `Bearer ${token}` },withCredentials: true,
  });
};
