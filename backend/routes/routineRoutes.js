const express = require('express');
const router = express.Router();
const { 
  getRoutinesBySkinType, 
  createRoutine,
  updateRoutine
} = require('../controllers/routineController');
router.get('/:skinType', getRoutinesBySkinType);
router.post('/', createRoutine);
router.put('/:id', updateRoutine);
module.exports = router;