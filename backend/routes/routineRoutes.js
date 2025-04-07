const express = require('express');
const router = express.Router();
const { getRoutinesBySkinType } = require('../controllers/routineController');
router.get('/:skinType', getRoutinesBySkinType);  // GET /api/routines/:skinType
module.exports = router;
