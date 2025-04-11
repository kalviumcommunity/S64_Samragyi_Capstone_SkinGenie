const User = require('../models/user');
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Hide passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
