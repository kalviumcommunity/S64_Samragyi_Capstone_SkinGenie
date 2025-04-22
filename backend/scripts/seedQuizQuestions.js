require('dotenv').config();
const mongoose = require('mongoose');
const QuizQuestion = require('../models/quizQuestion'); // adjust the path as needed

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const questions = [
  {
    question: "How does your skin feel after cleansing?",
    options: [
      { text: "Tight or dry", type: "Dry" },
      { text: "Comfortable", type: "Normal" },
      { text: "Oily or greasy", type: "Oily" }
    ]
  },
  {
    question: "Do you experience breakouts?",
    options: [
      { text: "Often", type: "Oily" },
      { text: "Sometimes", type: "Combination" },
      { text: "Rarely", type: "Dry" }
    ]
  },
  {
    question: "How does your skin look by midday?",
    options: [
      { text: "Shiny", type: "Oily" },
      { text: "Normal", type: "Normal" },
      { text: "Dry or flaky", type: "Dry" }
    ]
  },
  {
    question: "Is your skin sensitive or reactive?",
    options: [
      { text: "Yes", type: "Sensitive" },
      { text: "No", type: "Normal" }
    ]
  },
  {
    question: "What’s your main skin concern?",
    options: [
      { text: "Acne", type: "Oily" },
      { text: "Dryness", type: "Dry" },
      { text: "Aging", type: "Normal" },
      { text: "Redness", type: "Sensitive" }
    ]
  }
];

async function seed() {
  try {
    await QuizQuestion.deleteMany({});
    await QuizQuestion.insertMany(questions);
    console.log('Quiz questions seeded!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
