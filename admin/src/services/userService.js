import axios from "axios";
const API = "https://organicmulberry.onrender.com/api/users";

export const getAllUsers = (token) =>
  axios.get(`${API}/getAllUsers`, {
    headers: { Authorization: `Bearer ${token}` },withCredentials: true,
  });

export const createUser = (data, token) =>
  axios.post(`${API}/createUser`, data, {
    headers: { Authorization: `Bearer ${token}` },withCredentials: true,
  });

export const updateUser = (id, data, token) =>
  axios.put(`${API}/updateUser/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },withCredentials: true,
  });

export const deleteUser = (id, token) =>
  axios.delete(`${API}/deleteUser/${id}`, {
    headers: { Authorization: `Bearer ${token}` },withCredentials: true,
  });
