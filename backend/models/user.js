const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    minlength: 6,
    // Not required: so Google users can signup without password
  },
  googleId: {
    type: String,
    // Only set for Google users
  },
  skinType: {
    type: String,
    enum: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal']
  },
  recommendedRoutines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Routine'
  }]
}, { timestamps: true });

// Only hash password if it exists and is modified
userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;


