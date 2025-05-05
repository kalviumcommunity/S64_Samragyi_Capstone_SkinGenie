import React, { useEffect, useState } from 'react';
import { fetchComments } from '../api'; // Import API function

const CommentsList = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
              <strong>{comment.user}</strong>: {comment.comment}
            </li>
          ))}
        </ul>
      )}
      <div>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={page * limit >= totalComments}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CommentsList;