import axios from "axios";

const API_BASE = "https://organicmulberry.onrender.com/api/coupon";

export const getAllCoupons = async () => {
  try {
    const response = await axios.get(`${API_BASE}/getAll`,{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

export const createCoupon = async (couponData) => {
  try {
    const response = await axios.post(`${API_BASE}/create`, couponData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

export const updateCoupon = async (id, couponData) => {
  try {
    const response = await axios.put(`${API_BASE}/${id}`, couponData,{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

export const deleteCoupon = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/${id}`,{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

export const getCouponById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`,{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    throw error;
  }
};

