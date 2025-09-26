const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token: user not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateToken };
