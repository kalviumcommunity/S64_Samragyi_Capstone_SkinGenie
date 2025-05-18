const Comment = require('../models/Comment');
const { body, validationResult } = require('express-validator');
// Add a new comment to a product
exports.addComment = [
  // Validation rules
  body('comment').notEmpty().withMessage('Comment field is required'),

  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { productId } = req.params;
      const { comment } = req.body;

      // Validate productId as a number
      if (isNaN(productId)) {
        return res.status(400).json({ error: 'Invalid productId: Must be a number' });
      }

      // Ensure req.user exists
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User information missing' });
      }

      // Handle different token formats (Google vs regular login)
      let user;
      if (req.user.name) {
        user = req.user.name;
      } else if (req.user.displayName) {
        user = req.user.displayName;
      } else if (req.user.email) {
        // Fallback to email if name is not available
        user = req.user.email.split('@')[0]; // Use part before @ as username
      } else {
        return res.status(401).json({ error: 'Unauthorized: User name missing' });
      }

      // Create a new comment
      const newComment = new Comment({
        productId: parseInt(productId), // Store productId as a number
        user,
        comment,
      });

      // Save the comment to the database
      await newComment.save();

      // Send the created comment as the response
      res.status(201).json(newComment);
    } catch (error) {
      console.error('Error adding comment:', error.message);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  },
];

// Get all comments for a specific product with pagination
exports.getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    let { page = 1, limit = 10 } = req.query;

    // Validate productId as a number
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid productId: Must be a number' });
    }

    // Validate and sanitize pagination parameters
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1; // Default to page 1 if invalid
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 10; // Default to 10 if invalid or too large

    // Fetch comments with pagination
    const comments = await Comment.find({ productId: parseInt(productId) }) // Match productId as a number
      .sort({ createdAt: -1 }) // Sort by most recent
      .skip((page - 1) * limit) // Skip comments for previous pages
      .limit(limit); // Limit the number of comments per page

    // Count total comments for the product
    const totalComments = await Comment.countDocuments({ productId: parseInt(productId) });

    // Send response with total count and paginated comments
    res.status(200).json({
      totalComments,
      comments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
    });
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};
// Update a comment by ID (only by author)
exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    const existingComment = await Comment.findById(id);
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only the author can update their comment
    // Get user identifier from different possible token formats
    const userName = req.user.name || req.user.displayName || (req.user.email ? req.user.email.split('@')[0] : null);
    
    if (!userName || userName !== existingComment.user) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own comments.' });
    }

    existingComment.comment = comment;
    await existingComment.save();

    res.json(existingComment);
  } catch (err) {
    console.error('Error updating comment:', err.message);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

// Delete a comment by ID (only by author)
exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const existingComment = await Comment.findById(id);
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only the author can delete their comment
    // Get user identifier from different possible token formats
    const userName = req.user.name || req.user.displayName || (req.user.email ? req.user.email.split('@')[0] : null);
    
    if (!userName || userName !== existingComment.user) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own comments.' });
    }

    await existingComment.deleteOne();

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err.message);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};