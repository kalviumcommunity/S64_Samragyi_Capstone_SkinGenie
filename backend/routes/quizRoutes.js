const express = require('express');
const router = express.Router();
const { submitQuiz, getUserRoutines } = require('../controllers/quizController');

router.post('/submit', submitQuiz);
router.get('/routines/:userId', getUserRoutines);

module.exports = router;