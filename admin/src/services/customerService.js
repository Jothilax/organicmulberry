// // src/services/customerService.js
// import axios from "axios";

// const API_BASE = "http://localhost:3000/api/customer";

// export const getAllCustomers = async () => {
//   try {
//     const response = await axios.get(`${API_BASE}/getAllCustomers`);
//     return response.data.customers;
//   } catch (error) {
//     console.error("Error fetching customers:", error);
//     return [];
//   }
// };


// src/services/customerService.js
import axios from "axios";

const API_BASE = "http://16.171.20.13:5000/api/customer";
const API_PBASE = "http://16.171.20.13:5000/api/products";

export const getAllCustomers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/getAllCustomers`);
    return response.data.customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};
//http://localhost:3000/api/products/getCustomerOrders/4b63bfe4-6453-40de-b583-4784bd955b85
// Get orders of a customer
export const getCustomerOrders = async (customerId) => {
  try {
    const response = await axios.get(`${API_PBASE}/getCustomerOrders/${customerId}`);
    return response.data.orders;
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }
};
//http://localhost:3000/api/products/getOrderItems/0fd02cf9-7de4-4a13-8d0d-4493661549d2
// Get products in an order
export const getOrderProducts = async (orderId) => {
  try {
    const response = await axios.get(`${API_PBASE}/getOrderItems/${orderId}`);
    return response.data.items;
  } catch (error) {
    console.error("Error fetching order products:", error);
    return [];
  }
};
