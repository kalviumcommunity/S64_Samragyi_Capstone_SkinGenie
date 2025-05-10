const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // 1. Check for session-based authentication (e.g., Passport/Google)
  if (req.isAuthenticated && req.isAuthenticated()) {
    // Make sure we have the user's name for comment operations
    if (!req.user.name && req.user.displayName) {
      req.user.name = req.user.displayName;
    }
    return next();
  }
  // Some setups only set req.user, so you may want this fallback:
  if (req.user) {
    // Make sure we have the user's name for comment operations
    if (!req.user.name && req.user.displayName) {
      req.user.name = req.user.displayName;
    }
    return next();
  }

  // 2. Check for JWT in Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token or session.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Token has expired.' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Invalid token.' });
      }
      console.error('Token verification error:', err.message);
      return res.status(403).json({ message: 'Failed to authenticate token.' });
    }

    // Handle both token formats (id and userId)
    if (user.id && !user.userId) {
      user.userId = user.id;
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
