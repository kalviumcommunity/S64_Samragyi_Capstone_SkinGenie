const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getCommentsByProduct, addComment, updateComment, deleteComment } = require('../controllers/commentController');

// Get comments for a product
router.get('/:productId', getCommentsByProduct);

// Add a new comment
router.post('/:productId', authenticateToken, addComment);

// Update a comment
router.put('/:id', authenticateToken, updateComment);  // Corrected

// Delete a comment
router.delete('/:id', authenticateToken, deleteComment);  // Corrected

module.exports = router;