const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      type: { type: String, required: true } // e.g., 'Oily', 'Dry', etc.
    }
  ]
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
