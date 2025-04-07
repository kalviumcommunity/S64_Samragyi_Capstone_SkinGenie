const mongoose = require('mongoose');
const routineSchema = new mongoose.Schema({
  skinType: { type: String, required: true },  // e.g., "Oily", "Dry", etc.
  steps: [{ type: String, required: true }],  // e.g., ["Cleanser", "Toner"]
});
const Routine = mongoose.model('Routine', routineSchema);
module.exports = Routine;
