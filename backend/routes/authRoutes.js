const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Google OAuth initiate
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback with JWT response
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
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
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

module.exports = router;
