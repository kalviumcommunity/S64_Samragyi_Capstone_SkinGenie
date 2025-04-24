// models/UserRoutine.js
const mongoose = require('mongoose');

const userRoutineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amRoutine: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  pmRoutine: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const UserRoutine = mongoose.model('UserRoutine', userRoutineSchema);

module.exports = UserRoutine; // Export UserRoutine model
