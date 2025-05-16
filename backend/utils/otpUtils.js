const crypto = require('crypto');
const User = require('../models/user');

// Generate a random 6-digit OTP
const generateOTP = () => {
  // Generate a random number between 100000 and 999999 (6 digits)
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Save OTP to user document with expiration time (10 minutes)
const saveOTP = async (userId, otp) => {
  try {
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes
    
    await User.findByIdAndUpdate(userId, {
      resetPasswordOTP: otp,
      resetPasswordOTPExpiry: otpExpiry
    });
    
    return true;
  } catch (error) {
    console.error('Error saving OTP:', error);
    return false;
  }
};

// Verify if OTP is valid and not expired
const verifyOTP = async (userId, otp) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return { valid: false, message: 'User not found' };
    }
    
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
      return { valid: false, message: 'No OTP request found' };
    }
    
    if (user.resetPasswordOTP !== otp) {
      return { valid: false, message: 'Invalid OTP' };
    }
    
    const now = new Date();
    if (now > user.resetPasswordOTPExpiry) {
      return { valid: false, message: 'OTP has expired' };
    }
    
    return { valid: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { valid: false, message: 'Error verifying OTP' };
  }
};

// Clear OTP after successful verification or when generating a new one
const clearOTP = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      resetPasswordOTP: null,
      resetPasswordOTPExpiry: null
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing OTP:', error);
    return false;
  }
};

module.exports = {
  generateOTP,
  saveOTP,
  verifyOTP,
  clearOTP
};