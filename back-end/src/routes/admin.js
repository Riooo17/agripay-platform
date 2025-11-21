const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/adminAuth');

// All admin routes require admin authentication
router.use(requireAdmin);

// System overview and statistics
router.get('/overview', adminController.getSystemOverview);
router.get('/stats', adminController.getSystemStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.patch('/users/:userId/status', adminController.updateUserStatus);

// Impersonation
router.post('/impersonate/:userId', adminController.impersonateUser);
router.post('/stop-impersonation', adminController.stopImpersonation);

// Admin dashboard info
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Admin Dashboard API',
    version: '1.0.0',
    endpoints: {
      overview: 'GET /api/admin/overview - System overview',
      stats: 'GET /api/admin/stats - Detailed statistics',
      users: 'GET /api/admin/users - User management',
      userDetails: 'GET /api/admin/users/:userId - User details',
      updateUserStatus: 'PATCH /api/admin/users/:userId/status - Activate/deactivate user',
      impersonate: 'POST /api/admin/impersonate/:userId - Impersonate user',
      stopImpersonation: 'POST /api/admin/stop-impersonation - Stop impersonation'
    },
    features: {
      userManagement: 'View, filter, and manage all users',
      systemAnalytics: 'Comprehensive system statistics and growth metrics',
      userImpersonation: 'Temporarily act as any user for support',
      crossDashboardAccess: 'Access all role-specific dashboards',
      userStatusControl: 'Activate or deactivate user accounts'
    }
  });
});

module.exports = router;