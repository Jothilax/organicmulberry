import api from './api';

export const orderService = {
  // Create order from cart
  createOrder: async (paymentMethod = 'COD', address = '') => {
    try {
      const response = await api.post('/order/createOrder', {
        payment_method: paymentMethod,
        address,
      },{
          withCredentials: true,
        });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user orders
  getMyOrders: async () => {
    try {
      const response = await api.get('/order/myOrders',{
          withCredentials: true,
        });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const orders = await orderService.getMyOrders();
      return orders.find(o => o.id === id);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },
   downloadInvoice: async (id) => {
    try {
      const response = await api.get(
        `/order/generateOrderPDF/${id}`,
        {
          responseType: 'blob',
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  }
};

