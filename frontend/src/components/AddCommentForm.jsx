import React, { useState, useEffect } from 'react';
import { addComment, updateCommentAPI } from '../api';

const AddCommentForm = ({ productId, onCommentAdded, commentToEdit }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // If commentToEdit is passed, populate the form with the existing comment
    if (commentToEdit) {
      setComment(commentToEdit.comment);
      setIsEditing(true);
    }
  }, [commentToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let updatedComment;
      if (isEditing) {
        // Update the comment
        updatedComment = await updateCommentAPI(commentToEdit._id, comment);
      } else {
        // Add a new comment
        updatedComment = await addComment(productId, comment);
      }

      // Trigger the refresh of the comments list
      onCommentAdded(updatedComment);
      setComment('');
      setIsEditing(false); // Reset editing state after successful update or add
    } catch (err) {
      setError('Failed to add/update comment. Please try again.');
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
          {isSubmitting ? (isEditing ? 'Updating...' : 'Submitting...') : isEditing ? 'Update Comment' : 'Add Comment'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AddCommentForm;
