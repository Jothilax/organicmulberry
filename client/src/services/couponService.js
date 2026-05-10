import api from './api';

export const couponService = {
  getAvailableCoupons: async () => {
    try {
      const response = await api.get('/coupon/available',{
          withCredentials: true,
        });
      return response.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  },

  validateCoupon: async (code, totalAmount = 0) => {
    try {
      const response = await api.post('/coupon/validate', {
        code,
        total_amount: totalAmount,
      },{
          withCredentials: true,
        });
      return response.data;
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  },
};

