import React, { useEffect, useState } from 'react';
import { fetchComments, updateCommentAPI, deleteCommentAPI, getCurrentUser } from '../api'; // Import API functions

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

// Styles for comments
const commentListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: '20px 0',
};

const commentItemStyle = {
  padding: '15px',
  marginBottom: '10px',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  background: '#f9f9f9',
};

const currentUserCommentStyle = {
  ...commentItemStyle,
  background: '#f0f7ff',
  borderLeft: '3px solid #1976d2',
};

const commentHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const commentUserStyle = {
  fontWeight: 'bold',
  color: '#333',
};

const commentTextStyle = {
  margin: '10px 0',
};

const commentActionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '10px',
};

const CommentsList = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const limit = 10; // Number of comments per page

  // Fetch current user information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (localStorage.getItem('token')) {
          const userData = await getCurrentUser();
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  // Fetch comments
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
      ) : comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        <ul style={commentListStyle}>
          {comments.map((comment) => {
            // Check if this comment belongs to the current user
            const isCurrentUserComment = currentUser && 
              (currentUser.name === comment.user || currentUser.email === comment.user);
            
            return (
              <li 
                key={comment._id} 
                style={isCurrentUserComment ? currentUserCommentStyle : commentItemStyle}
              >
                <div style={commentHeaderStyle}>
                  <span style={commentUserStyle}>
                    {comment.user} {isCurrentUserComment && '(You)'}
                  </span>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                
                {editingCommentId === comment._id ? (
                  <div>
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    <div style={commentActionsStyle}>
                      <button
                        style={updateBtnStyle}
                        onClick={() => handleUpdateComment(comment._id)}
                      >
                        Update
                      </button>
                      <button
                        style={{...navBtnStyle, marginLeft: '10px'}}
                        onClick={() => setEditingCommentId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={commentTextStyle}>{comment.comment}</div>
                    
                    {/* Only show edit/delete buttons for the current user's comments */}
                    {isCurrentUserComment && (
                      <div style={commentActionsStyle}>
                        <button
                          style={editBtnStyle}
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setNewCommentText(comment.comment);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          style={{...deleteBtnStyle, marginLeft: '10px'}}
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {totalComments > limit && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button
            style={{...navBtnStyle, opacity: page === 1 ? 0.5 : 1}}
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            Previous
          </button>
          <span style={{ margin: '0 15px', lineHeight: '32px' }}>
            Page {page} of {Math.ceil(totalComments / limit)}
          </span>
          <button
            style={{...navBtnStyle, opacity: page * limit >= totalComments ? 0.5 : 1}}
            onClick={handleNextPage}
            disabled={page * limit >= totalComments}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
