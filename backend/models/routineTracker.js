const mongoose = require('mongoose');

const routineTrackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  completedItems: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    timeOfDay: {
      type: String,
      enum: ['AM', 'PM'],
      required: true
    }
  }],
  notes: {
    type: String
  }
}, { timestamps: true });

// Create a compound index to ensure one entry per user per day
routineTrackerSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('RoutineTracker', routineTrackerSchema);