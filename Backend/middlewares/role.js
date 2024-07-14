function checkAdminRole(req, res, next) {
    if (req.user && req.user.role === 'ADMIN') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  }
  
  module.exports = {
    checkAdminRole,
  };