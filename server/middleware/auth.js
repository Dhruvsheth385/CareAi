//auth.js
// File: server/middleware/auth.js
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Get token from cookie or header
    const token = req.cookies.token || 
                  (req.headers.authorization && req.headers.authorization.startsWith('Bearer') 
                   ? req.headers.authorization.split(' ')[1] : null);
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default auth;