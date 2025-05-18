const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Comment = require('../models/Comment');
const { getCommentsByProduct, addComment } = require('../controllers/commentController');

// Mock Express request and response
const mockRequest = (params = {}, query = {}, body = {}, user = null) => ({
  params,
  query,
  body,
  user
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Comment Controller', () => {
  let mongoServer;

  // Set up MongoDB Memory Server before tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  // Clean up after tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear the database between tests
  beforeEach(async () => {
    await Comment.deleteMany({});
  });

  describe('getCommentsByProduct', () => {
    test('should return empty comments array when no comments exist', async () => {
      // Arrange
      const req = mockRequest(
        { productId: '1' },  // params
        { page: 1, limit: 10 },  // query
        {},  // body
        { name: 'testUser' }  // user
      );
      const res = mockResponse();

      // Act
      await getCommentsByProduct(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          totalComments: 0,
          comments: [],
          currentPage: 1,
          totalPages: 0
        })
      );
    });

    test('should return comments for a specific product', async () => {
      // Arrange - Create test comments
      await Comment.create([
        { productId: 1, user: 'User1', comment: 'Comment 1' },
        { productId: 1, user: 'User2', comment: 'Comment 2' },
        { productId: 2, user: 'User3', comment: 'Comment 3' }, // Different product
      ]);

      const req = mockRequest(
        { productId: '1' },  // params
        { page: 1, limit: 10 },  // query
        {},  // body
        null  // user
      );
      const res = mockResponse();

      // Act
      await getCommentsByProduct(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      
      // Check that we got the right number of comments
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.totalComments).toBe(2);
      expect(responseData.comments.length).toBe(2);
      
      // Check comment content
      const commentTexts = responseData.comments.map(c => c.comment);
      expect(commentTexts).toContain('Comment 1');
      expect(commentTexts).toContain('Comment 2');
      expect(commentTexts).not.toContain('Comment 3');
    });
  });
});