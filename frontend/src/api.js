// api.js
import axios from './axios.config';

// Fetch comments for a specific product
export const fetchComments = async (productId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/api/comments/${productId}`, {
      params: { page, limit },
    });
    return response.data; // Returns { totalComments, comments }
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw error;
  }
};

// Add a new comment to a product
export const addComment = async (productId, comment) => {
  try {
    const response = await axios.post(`api/comments/${productId}`, { comment });
    return response.data; // Returns the newly added comment
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw error;
  }
};
