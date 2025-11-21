const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

const adminController = {
  // Get system overview
  getSystemOverview: async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const usersByRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]);
      
      const totalOrders = await Order.countDocuments();
      const totalProducts = await Product.countDocuments();
      
      const recentUsers = await User.find()
        .select('name email role createdAt')
        .sort({ createdAt: -1 })
        .limit(10);
      
      const recentOrders = await Order.find()
        .populate('buyer', 'name email')
        .populate('farmer', 'name email')
        .sort({ createdAt: -1 })
        .limit(10);

      res.json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalOrders,
            totalProducts,
            usersByRole: usersByRole.reduce((acc, curr) => {
              acc[curr._id] = curr.count;
              return acc;
            }, {})
          },
          recentActivity: {
            users: recentUsers,
            orders: recentOrders
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching system overview',
        error: error.message
      });
    }
  },

  // Get all users with filtering and pagination
  getAllUsers: async (req, res) => {
    try {
      const { role, search, page = 1, limit = 10 } = req.query;
      
      const filter = {};
      if (role && role !== 'all') filter.role = role;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(filter);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalUsers: total,
            hasNext: page * limit < total,
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: error.message
      });
    }
  },

  // Get user details
  getUserDetails: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Get user-specific data based on role
      let userData = { user };
      
      if (user.role === 'farmer') {
        const products = await Product.find({ farmer: user._id });
        const orders = await Order.find({ farmer: user._id })
          .populate('buyer', 'name email');
        
        userData.products = products;
        userData.orders = orders;
      } else if (user.role === 'buyer') {
        const orders = await Order.find({ buyer: user._id })
          .populate('farmer', 'name email businessName');
        
        userData.orders = orders;
      }

      res.json({
        success: true,
        data: userData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user details',
        error: error.message
      });
    }
  },

  // Impersonate user (admin can act as any user)
  impersonateUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Create impersonation token
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { 
          userId: user._id,
          originalAdminId: req.user._id, // Store original admin ID
          isImpersonating: true 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        success: true,
        message: `Now impersonating ${user.role}: ${user.email}`,
        data: {
          user: {
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name
          },
          token,
          isImpersonating: true,
          originalAdminId: req.user._id
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error impersonating user',
        error: error.message
      });
    }
  },

  // Stop impersonation and return to admin
  stopImpersonation: async (req, res) => {
    try {
      const admin = await User.findById(req.user.originalAdminId).select('-password');
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Original admin not found'
        });
      }

      // Create admin token
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { userId: admin._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Impersonation stopped. Returning to admin account.',
        data: {
          user: admin,
          token,
          isImpersonating: false
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error stopping impersonation',
        error: error.message
      });
    }
  },

  // Update user status (activate/deactivate)
  updateUserStatus: async (req, res) => {
    try {
      const { isActive } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isActive },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating user status',
        error: error.message
      });
    }
  },

  // Get system statistics
  getSystemStats: async (req, res) => {
    try {
      // User statistics
      const userStats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            active: {
              $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
            }
          }
        }
      ]);

      // Order statistics
      const orderStats = await Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]);

      // Monthly user growth
      const monthlyGrowth = await User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]);

      res.json({
        success: true,
        data: {
          userStats,
          orderStats,
          monthlyGrowth
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching system statistics',
        error: error.message
      });
    }
  }
};

module.exports = adminController;