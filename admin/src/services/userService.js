import axios from "axios";
const API = "http://localhost:3000/api/users";

export const getAllUsers = (token) =>
  axios.get(`${API}/getAllUsers`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createUser = (data, token) =>
  axios.post(`${API}/createUser`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUser = (id, data, token) =>
  axios.put(`${API}/updateUser/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUser = (id, token) =>
  axios.delete(`${API}/deleteUser/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
