const express = require('express');
const router = express.Router();
const { 
  requestPasswordReset, 
  verifyPasswordResetOTP, 
  resetPassword 
} = require('../controllers/passwordResetController');

// Request password reset (send OTP)
router.post('/request', requestPasswordReset);

// Verify OTP
router.post('/verify-otp', verifyPasswordResetOTP);

// Reset password with OTP
router.post('/reset', resetPassword);

module.exports = router;