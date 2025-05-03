const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, loginUser, getCurrentUser } = require('../controllers/userController'); // Import the new controller
const { body } = require('express-validator');
const authenticateToken = require('../middleware/authMiddleware'); // Middleware for token authentication

// Validation rules for signup and login
const validateSignup = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
const validateLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/signup', validateSignup, createUser); // Signup route
router.post('/login', validateLogin, loginUser); // Login route
router.get('/users', authenticateToken, getAllUsers); // Get all users route
router.get('/users/me', authenticateToken, getCurrentUser); // Get current user route

module.exports = router;