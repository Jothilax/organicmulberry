import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

export const loginUser = (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};

// ✅ Change password API
export const changePassword = async (username, oldPassword, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/changePassword`, {
      username,
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Change Password Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Logout API
export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    console.error("Logout Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Forgot Password API
export const forgotPassword = async (username) => {
  try {
    const response = await axios.post(`${API_URL}/forgotPassword`, {
      username,
    });
    return response.data;
  } catch (error) {
    console.error("Forgot Password Error:", error);
    throw error.response?.data || error.message;
  }
};