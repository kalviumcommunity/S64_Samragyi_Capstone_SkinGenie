const express = require('express');
const router = express.Router();
const { 
  getRoutinesBySkinType,
  createRoutine 
} = require('../controllers/routineController'); 
router.get('/:skinType', getRoutinesBySkinType);
router.post('/', createRoutine);
module.exports = router;