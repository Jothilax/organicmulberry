import api from './api';

export const productService = {
  // Get all products
  getAllProducts: async (search = '') => {
    try {
      const response = await api.get('/products/getAllProducts', {
        params: { search },
      },{
      withCredentials: true,
    });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/getProductById/${id}`,{
      withCredentials: true,
    });
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },
};

