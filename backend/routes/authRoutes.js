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
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
  (req, res) => {
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
    res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  }
);

module.exports = router;
