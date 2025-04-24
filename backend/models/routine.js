const mongoose = require('mongoose');
const routineSchema = new mongoose.Schema({
  skinType: { 
    type: String, 
    required: true, 
    trim: true,
    enum: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'] 
  },
steps: [{
  type: mongoose.Schema.Types.ObjectId, // Use ObjectId
  ref: 'Product', // Reference Product model
  required: true
}]

}, { timestamps: true });
const Routine = mongoose.model('Routine', routineSchema);
module.exports = Routine;
