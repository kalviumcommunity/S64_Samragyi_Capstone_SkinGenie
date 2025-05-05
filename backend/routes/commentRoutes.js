const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getCommentsByProduct, addComment } = require('../controllers/commentController');

// Route to get all comments for a product
router.get('/:productId', getCommentsByProduct);

// Route to add a new comment to a product
router.post('/:productId', authenticateToken, addComment);

module.exports = router;