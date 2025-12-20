import QRCode from 'qrcode';

/**
 * Generate QR code for an order
 * @param {Object} orderData - Order information to encode in QR code
 * @returns {Promise<string>} - Base64 encoded QR code image
 */
export const generateOrderQRCode = async (orderData) => {
  try {
    // Create QR code data string with order information
    const qrData = JSON.stringify({
      orderId: orderData.id,
      orderCode: orderData.order_code,
      totalAmount: orderData.total_amount,
      status: orderData.status,
      createdAt: orderData.createdAt,
      customerId: orderData.user_id
    });

    // Generate QR code as base64 data URL
    const qrCodeBase64 = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    });

    return qrCodeBase64;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

