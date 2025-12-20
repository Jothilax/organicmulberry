import api from './api';

export const authService = {
  // Request OTP
  requestOTP: async (email, phone) => {
    try {
      const response = await api.post('/customer/requestOtp', {
        email,
        phone,
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting OTP:', error);
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (email, phone, otp) => {
    try {
      const response = await api.post('/customer/verify-otp', {
        email,
        phone,
        otp,
      });
      if (response.data.token) {
        localStorage.setItem('customerToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },

  // Get customer profile
  getProfile: async () => {
    try {
      const response = await api.get('/customer/getProfile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/customer/updateProfile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

