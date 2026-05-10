import api from './api';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories/getAllCategories',{
          withCredentials: true,
        });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/getCategoryById/${id}`,{
          withCredentials: true,
        });
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },
};

