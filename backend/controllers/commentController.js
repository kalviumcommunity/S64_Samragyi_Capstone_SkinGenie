const Comment = require('../models/Comment');
const { body, validationResult } = require('express-validator');

// Add a new comment to a product
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

      // Ensure req.user exists and has 'name'
      if (!req.user || !req.user.name) {
        return res.status(401).json({ error: 'Unauthorized: User information missing' });
      }

      // Use the authenticated user's name from req.user
      const user = req.user.name;

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