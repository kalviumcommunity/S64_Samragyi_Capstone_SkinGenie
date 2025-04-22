const express = require('express');
const router = express.Router();
const { submitQuiz, getUserRoutines } = require('../controllers/quizController');
const { getQuizQuestions, createQuizQuestion } = require('../controllers/quizController');
router.post('/submit', submitQuiz);
router.get('/routines/:userId', getUserRoutines);
router.get('/questions', getQuizQuestions);
// router.post('/questions', createQuizQuestion); // Uncomment for admin use
module.exports = router;