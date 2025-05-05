const User = require('../models/user');
const bcrypt = require('bcrypt'); // For password hashing
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

/**
 * Create a new user
 */
exports.createUser = async (req, res) => {
  // Validate incoming request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create the user
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Send response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Log in an existing user
 */
exports.loginUser = async (req, res) => {
  // Validate incoming request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email }, // Include name in token payload
      process.env.JWT_SECRET,
      { expiresIn: '7h' } // Set token expiration
    );

    // Send response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Error logging in user:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all users (Admin functionality)
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding their passwords
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get the currently logged-in user
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // Find the user by ID from the token payload
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send response
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error('Error fetching current user:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};