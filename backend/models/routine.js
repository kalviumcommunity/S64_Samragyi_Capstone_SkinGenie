const mongoose = require('mongoose');
const routineSchema = new mongoose.Schema({
  skinType: { 
    type: String, 
    required: true, 
    trim: true,
    enum: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'] 
  },
  steps: { 
    type: [String], 
    required: true,
    validate: {
      validator: v => v.length > 0 && v.every(s => s?.trim()),
      message: 'Steps must be a non-empty array of strings'
    }
  }
}, { timestamps: true });
const Routine = mongoose.model('Routine', routineSchema);
module.exports = Routine;
