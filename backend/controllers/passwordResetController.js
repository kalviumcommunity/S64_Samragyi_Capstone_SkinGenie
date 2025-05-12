const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateOTP, saveOTP, verifyOTP, clearOTP } = require('../utils/otpUtils');
const { sendPasswordResetOTP } = require('../utils/emailService');

// Request password reset and send OTP
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return res.status(200).json({ 
        message: 'If your email is registered, you will receive a password reset OTP shortly' 
      });
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Save OTP to user document
    const otpSaved = await saveOTP(user._id, otp);
    
    if (!otpSaved) {
      return res.status(500).json({ message: 'Failed to generate OTP. Please try again.' });
    }
    
    // Send OTP via email
    const emailSent = await sendPasswordResetOTP(user.email, user.name, otp);
    
    if (!emailSent) {
      // Clear the OTP if email fails
      await clearOTP(user._id);
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }
    
    // For development, log the OTP to console
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV ONLY] OTP for ${user.email}: ${otp}`);
    }
    
    // Return success response with userId (needed for verification)
    return res.status(200).json({
      message: 'Password reset OTP has been sent to your email',
      userId: user._id
    });
    
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Verify OTP
const verifyPasswordResetOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    if (!userId || !otp) {
      return res.status(400).json({ message: 'User ID and OTP are required' });
    }
    
    // Verify OTP
    const verification = await verifyOTP(userId, otp);
    
    if (!verification.valid) {
      return res.status(400).json({ message: verification.message });
    }
    
    // Return success response
    return res.status(200).json({
      message: 'OTP verified successfully',
      userId
    });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Reset password after OTP verification
const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    
    if (!userId || !otp || !newPassword) {
      return res.status(400).json({ 
        message: 'User ID, OTP, and new password are required' 
      });
    }
    
    // Verify OTP again for security
    const verification = await verifyOTP(userId, otp);
    
    if (!verification.valid) {
      return res.status(400).json({ message: verification.message });
    }
    
    // Password validation
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user's password and clear OTP
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      resetPasswordOTP: null,
      resetPasswordOTPExpiry: null
    });
    
    // Return success response
    return res.status(200).json({
      message: 'Password has been reset successfully'
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = {
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword
};