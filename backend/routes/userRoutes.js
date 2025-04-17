const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, loginUser } = require('../controllers/userController');
const { body } = require('express-validator');

const validateSignup = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/signup', validateSignup, createUser);
router.post('/login', validateLogin, loginUser);
router.get('/users', getAllUsers);
module.exports = router;
