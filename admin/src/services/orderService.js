import axios from "axios";

const API_BASE = "https://organicmulberry.onrender.com/api/order";

export const getAllOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
// Download orders Excel
export const downloadOrdersExcel = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_BASE}/downloadOrdersExcel`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Excel export error:", error);
    throw error;
  }
};
