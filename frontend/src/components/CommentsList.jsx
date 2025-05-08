import React, { useEffect, useState } from 'react';
import { fetchComments, updateCommentAPI, deleteCommentAPI } from '../api'; // Import API functions

const editBtnStyle = {
  background: '#e3f0ff',
  color: '#1976d2',
  margin: '0 6px',
  padding: '5px 16px',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
};

const deleteBtnStyle = {
  background: '#ffeaea',
  color: '#d32f2f',
  margin: '0 6px',
  padding: '5px 16px',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
};

const updateBtnStyle = {
  background: '#eaffea',
  color: '#388e3c',
  margin: '0 6px',
  padding: '5px 16px',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
};

const navBtnStyle = {
  background: '#f0f0f0',
  color: '#333',
  margin: '0 6px',
  padding: '5px 16px',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
};

const CommentsList = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  const limit = 10; // Number of comments per page

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await fetchComments(productId, page, limit);
        setComments(data.comments);
        setTotalComments(data.totalComments);
      } catch (err) {
        setError('Failed to load comments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [productId, page]);

  const handleNextPage = () => {
    if (page * limit < totalComments) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await updateCommentAPI(commentId, newCommentText);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, comment: newCommentText }
            : comment
        )
      );
      setEditingCommentId(null);
      setNewCommentText('');
    } catch (err) {
      setError('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentAPI(commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading ? (
        <p>Loading comments...</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment._id}>
              <strong>{comment.user}</strong>:{' '}
              {editingCommentId === comment._id ? (
                <div>
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                  <button
                    style={updateBtnStyle}
                    onClick={() => handleUpdateComment(comment._id)}
                  >
                    Update
                  </button>
                </div>
              ) : (
                <span>{comment.comment}</span>
              )}
              <button
                style={deleteBtnStyle}
                onClick={() => handleDeleteComment(comment._id)}
              >
                Delete
              </button>
              <button
                style={editBtnStyle}
                onClick={() => setEditingCommentId(comment._id)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <button
          style={navBtnStyle}
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          style={navBtnStyle}
          onClick={handleNextPage}
          disabled={page * limit >= totalComments}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CommentsList;
