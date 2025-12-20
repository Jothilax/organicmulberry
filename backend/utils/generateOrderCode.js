/**
 * Generate a unique order code
 * Format: ORD-YYYYMMDD-XXXXXX (e.g., ORD-20241114-ABC123)
 */
export const generateOrderCode = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Generate random alphanumeric string (6 characters)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `ORD-${dateStr}-${randomStr}`;
};

