const mongoose = require('mongoose');
const routineSchema = new mongoose.Schema({
  skinType: { 
    type: String, required: true, trim: true,
    enum: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'] 
  },
  steps: { 
    type: [String], required: true,
    validate: [v => v.length > 0 && v.every(s => s?.trim()), "Invalid steps"] 
  }
}, { timestamps: true });
module.exports = Routine;
