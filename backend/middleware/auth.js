const jwt = require('jsonwebtoken');
const Librarian = require('../models/Librarian');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const librarian = await Librarian.findById(decoded.id);
    
    if (!librarian) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.librarian = librarian;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

module.exports = auth;