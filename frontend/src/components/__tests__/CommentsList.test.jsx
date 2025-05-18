import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CommentsList from '../CommentsList';
import * as api from '../../api';

// Mock the API module
jest.mock('../../api', () => ({
  fetchComments: jest.fn(),
  getCurrentUser: jest.fn(),
  updateCommentAPI: jest.fn(),
  deleteCommentAPI: jest.fn(),
}));

describe('CommentsList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    // Mock API responses
    api.fetchComments.mockResolvedValue({ comments: [], totalComments: 0 });
    api.getCurrentUser.mockResolvedValue(null);

    render(<CommentsList productId={1} />);
    
    // Check if loading message is displayed
    expect(screen.getByText('Loading comments...')).toBeInTheDocument();
  });

  test('displays no comments message when there are no comments', async () => {
    // Mock API responses
    api.fetchComments.mockResolvedValue({ comments: [], totalComments: 0 });
    api.getCurrentUser.mockResolvedValue(null);

    render(<CommentsList productId={1} />);
    
    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();
    });
  });

  test('displays comments when they are loaded', async () => {
    // Mock API responses with sample comments
    const mockComments = [
      {
        _id: '1',
        user: 'TestUser',
        comment: 'This is a test comment',
        createdAt: new Date().toISOString(),
      },
      {
        _id: '2',
        user: 'AnotherUser',
        comment: 'Another test comment',
        createdAt: new Date().toISOString(),
      },
    ];
    
    api.fetchComments.mockResolvedValue({ 
      comments: mockComments, 
      totalComments: mockComments.length 
    });
    api.getCurrentUser.mockResolvedValue(null);

    render(<CommentsList productId={1} />);
    
    // Wait for the comments to be displayed
    await waitFor(() => {
      expect(screen.getByText('TestUser')).toBeInTheDocument();
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      expect(screen.getByText('AnotherUser')).toBeInTheDocument();
      expect(screen.getByText('Another test comment')).toBeInTheDocument();
    });
  });
});