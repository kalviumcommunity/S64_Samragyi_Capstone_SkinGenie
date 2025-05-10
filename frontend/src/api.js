// api.js
import axios from './axios.config';

// Get current user information
export const getCurrentUser = async () => {
  try {
    const response = await axios.get('/api/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    throw error;
  }
};

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
    const response = await axios.post(`/api/comments/${productId}`, { comment });
    return response.data; // Returns the newly added comment
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw error;
  }
};

export const updateCommentAPI = async (commentId, newCommentText) => {
  try {
    const response = await axios.put(`/api/comments/${commentId}`, { comment: newCommentText });
    return response.data; // Returns the updated comment
  } catch (error) {
    console.error('Failed to update comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteCommentAPI = async (commentId) => {
  try {
    const response = await axios.delete(`/api/comments/${commentId}`);
    return response.data; // Confirms the comment deletion
  } catch (error) {
    console.error('Failed to delete comment:', error);
    throw error;
  }
};
