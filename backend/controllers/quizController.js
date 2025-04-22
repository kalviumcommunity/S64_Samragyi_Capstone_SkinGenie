const User = require('../models/user');
const Routine = require('../models/routine');
const QuizQuestion = require('../models/quizQuestion');

exports.submitQuiz = async (req, res) => {
  try {
    const { skinType } = req.body;
    const userId = req.body.userId; 
    const matchingRoutines = await Routine.find({ skinType });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        skinType, 
        recommendedRoutines: matchingRoutines.map(routine => routine._id)
      },
      { new: true }
    ).populate('recommendedRoutines');
    res.status(200).json({
      skinType,
      recommendedRoutines: updatedUser.recommendedRoutines
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getUserRoutines = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .populate('recommendedRoutines');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      skinType: user.skinType,
      recommendedRoutines: user.recommendedRoutines
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Fetch all quiz questions
exports.getQuizQuestions = async (req, res) => {
  try {
    const questions = await QuizQuestion.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// (Optional) Add a function to create quiz questions for admin use
exports.createQuizQuestion = async (req, res) => {
  try {
    const { question, options } = req.body;
    const newQuestion = await QuizQuestion.create({ question, options });
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};