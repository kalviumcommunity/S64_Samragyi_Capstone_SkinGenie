const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authMiddleware');

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request, response, and next function
    req = {
      headers: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    next = jest.fn();
    
    // Mock process.env
    process.env.JWT_SECRET = 'test-secret';
  });

  test('should return 401 if no token is provided', () => {
    // Act
    authenticateToken(req, res, next);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Access denied. No token or session.'
    }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 403 if token is invalid', () => {
    // Arrange
    req.headers.authorization = 'Bearer invalid-token';
    
    // Mock the verify function to call the callback with an error
    jwt.verify.mockImplementation((token, secret, callback) => {
      const error = { name: 'JsonWebTokenError', message: 'Invalid token' };
      callback(error, null);
    });
    
    // Act
    authenticateToken(req, res, next);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Invalid token.'
    }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should set req.user and call next if token is valid', () => {
    // Arrange
    const mockUser = { id: '123', name: 'Test User' };
    req.headers.authorization = 'Bearer valid-token';
    
    // Mock the verify function to call the callback with a valid user
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });
    
    // Act
    authenticateToken(req, res, next);
    
    // Assert
    expect(req.user).toEqual(expect.objectContaining({
      id: '123',
      name: 'Test User',
      userId: '123' // This is added by the middleware
    }));
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});