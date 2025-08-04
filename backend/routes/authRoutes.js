const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Frontend URL based on environment
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Google OAuth initiate
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback with JWT response
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${FRONTEND_URL}/login?error=auth_failed`,
    failureMessage: true 
  }),
  (req, res) => {
    try {
      console.log('Google OAuth callback - User:', req.user);
      
      if (!req.user) {
        console.error('No user found in Google OAuth callback');
        return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
      }

      // Include the same user information as in regular login
      const token = jwt.sign(
        { 
          userId: req.user._id, 
          name: req.user.name, 
          email: req.user.email 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7h' }
      );
      
      console.log('Google OAuth success - redirecting with token');
      res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
      console.error('Error in Google OAuth callback:', error);
      res.redirect(`${FRONTEND_URL}/login?error=callback_error`);
    }
  }
);

module.exports = router;
