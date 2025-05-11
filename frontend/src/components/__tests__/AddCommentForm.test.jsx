import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddCommentForm from '../AddCommentForm';
import * as api from '../../api';

// Mock the API module
jest.mock('../../api', () => ({
  addComment: jest.fn(),
  updateCommentAPI: jest.fn(),
}));

describe('AddCommentForm Component', () => {
  const mockProductId = '123';
  const mockOnCommentAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form correctly', () => {
    render(
      <AddCommentForm 
        productId={mockProductId} 
        onCommentAdded={mockOnCommentAdded} 
      />
    );
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Add Comment');
  });

  test('handles comment submission correctly', async () => {
    // Mock successful API response
    const newComment = { _id: '1', comment: 'Test comment', user: 'TestUser' };
    api.addComment.mockResolvedValue(newComment);
    
    render(
      <AddCommentForm 
        productId={mockProductId} 
        onCommentAdded={mockOnCommentAdded} 
      />
    );
    
    // Fill in the comment field
    const commentInput = screen.getByLabelText(/comment/i);
    fireEvent.change(commentInput, { target: { value: 'Test comment' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    
    // Wait for the API call to complete
    await waitFor(() => {
      // Check if the API was called with correct parameters
      expect(api.addComment).toHaveBeenCalledWith(mockProductId, 'Test comment');
      // Check if the callback was called with the new comment
      expect(mockOnCommentAdded).toHaveBeenCalledWith(newComment);
      // Check if the form was reset
      expect(commentInput.value).toBe('');
    });
  });

  test('handles comment editing correctly', async () => {
    // Mock comment to edit
    const commentToEdit = { 
      _id: '1', 
      comment: 'Original comment', 
      user: 'TestUser' 
    };
    
    // Mock successful API response
    const updatedComment = { 
      ...commentToEdit, 
      comment: 'Updated comment' 
    };
    api.updateCommentAPI.mockResolvedValue(updatedComment);
    
    render(
      <AddCommentForm 
        productId={mockProductId} 
        onCommentAdded={mockOnCommentAdded}
        commentToEdit={commentToEdit}
      />
    );
    
    // Check if the form is pre-filled with the comment to edit
    const commentInput = screen.getByLabelText(/comment/i);
    expect(commentInput.value).toBe('Original comment');
    
    // Check if the button text is correct for editing
    expect(screen.getByRole('button')).toHaveTextContent('Update Comment');
    
    // Change the comment text
    fireEvent.change(commentInput, { target: { value: 'Updated comment' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    
    // Wait for the API call to complete
    await waitFor(() => {
      // Check if the API was called with correct parameters
      expect(api.updateCommentAPI).toHaveBeenCalledWith('1', 'Updated comment');
      // Check if the callback was called with the updated comment
      expect(mockOnCommentAdded).toHaveBeenCalledWith(updatedComment);
      // Check if the form was reset
      expect(commentInput.value).toBe('');
    });
  });
});