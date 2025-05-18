const express = require('express');
const router = express.Router();
const {
  getRoutinesBySkinType,
  createRoutine,
  updateRoutine
} = require('../controllers/routineController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Route to get routines by skin type - protected
router.get('/:skinType', authenticateToken, getRoutinesBySkinType);

// Create a new routine - protected
router.post('/', authenticateToken, createRoutine);

// Update an existing routine by ID - protected
router.put('/:id', authenticateToken, updateRoutine);

module.exports = router;