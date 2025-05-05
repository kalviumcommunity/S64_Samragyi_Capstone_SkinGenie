// AddCommentForm.jsx
import React, { useState } from 'react';
import { addComment } from '../api';

const AddCommentForm = ({ productId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const newComment = await addComment(productId, comment); // Only send comment
      onCommentAdded(newComment);
      setComment('');
    } catch (err) {
      setError('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Comment:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Add Comment'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AddCommentForm;
