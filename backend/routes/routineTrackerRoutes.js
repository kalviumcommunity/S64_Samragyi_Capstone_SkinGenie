const express = require('express');
const router = express.Router();
const routineTrackerController = require('../controllers/routineTrackerController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication middleware to individual routes
// Get tracking data for a user
router.get('/:userId', authenticateToken, routineTrackerController.getRoutineTracking);

// Track a routine item as completed or not completed
router.post('/track', authenticateToken, routineTrackerController.trackRoutineItem);

// Add notes to a tracking entry
router.post('/notes', authenticateToken, routineTrackerController.addTrackingNotes);

module.exports = router;