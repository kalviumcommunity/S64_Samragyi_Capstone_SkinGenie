const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: Number, // Match the `id` field in your JSON products
      required: true,
    },
    user: {
      type: String, // Name of the user
      required: true,
    },
    comment: {
      type: String, // User's comment
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the timestamp
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);