import api from './api';

export const cartService = {
  // Add product to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/addToCart', {
        product_id: productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Get cart items
  getCart: async () => {
    try {
      const response = await api.get('/cart/getCart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    try {
      const response = await api.delete(`/cart/removeFromCart/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },
};

