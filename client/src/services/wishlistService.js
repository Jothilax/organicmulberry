import api from './api';

export const wishlistService = {
  // Add product to wishlist
  addToWishlist: async (productId) => {
    try {
      const response = await api.post('/wishlist/addToWishlist', {
        product_id: productId,
      },{
      withCredentials: true,
    });
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Get wishlist items
  getWishlist: async () => {
    try {
      const response = await api.get('/wishlist/getWishlist',{
      withCredentials: true,
    });
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (wishlistItemId) => {
    try {
      const response = await api.delete(`/wishlist/removeFromWishlist/${wishlistItemId}`,{
      withCredentials: true,
    });
      return response.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Check if product is in wishlist
  checkWishlist: async (productId) => {
    try {
      const response = await api.get(`/wishlist/checkWishlist/${productId}`,{
      withCredentials: true,
    });
      return response.data;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      throw error;
    }
  },
};

