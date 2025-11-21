const { authenticate } = require('./auth');

const requireAdmin = (req, res, next) => {
  authenticate(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  });
};

// Middleware to allow admin OR specific role
const requireAdminOrRole = (allowedRole) => {
  return (req, res, next) => {
    authenticate(req, res, () => {
      if (req.user.role === 'admin' || req.user.role === allowedRole) {
        return next();
      }
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires admin or ${allowedRole} privileges.`
      });
    });
  };
};

module.exports = { requireAdmin, requireAdminOrRole };