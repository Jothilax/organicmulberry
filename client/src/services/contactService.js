import api from './api';

export const contactService = {
  submitContact: async (formData) => {
    try {
      const response = await api.post('/contact/submit', formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },
};

