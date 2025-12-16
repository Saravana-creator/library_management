const roleAuth = (requiredRole) => {
  return (req, res, next) => {
    if (!req.librarian) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (req.librarian.role !== requiredRole && req.librarian.role !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    next();
  };
};

module.exports = roleAuth;
