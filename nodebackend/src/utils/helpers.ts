// Generate dummy OTP (for development)
export const generateOTP = (): string => {
  return '123456'; // In production, generate random 6-digit OTP
};

// Calculate OTP expiry time
export const getOtpExpiry = (): Date => {
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
};

// Check if OTP is expired
export const isOtpExpired = (expiry: Date): boolean => {
  return new Date() > expiry;
};

// Validate Indian phone number
export const isValidIndianPhone = (phone: string): boolean => {
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  return indianPhoneRegex.test(phone);
};