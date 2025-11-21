const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get farmer dashboard overview
// @route   GET /api/farmer/dashboard
// @access  Private (Farmer only)
exports.getDashboard = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    
    // Get basic counts
    const [
      totalProducts,
      activeOrders,
      pendingOrders,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      // Total products
      Product.countDocuments({ farmer: farmerId }),
      
      // Active orders (confirmed, paid, preparing, ready, shipped)
      Order.countDocuments({ 
        farmer: farmerId, 
        status: { $in: ['confirmed', 'paid', 'preparing', 'ready', 'shipped'] } 
      }),
      
      // Pending orders
      Order.countDocuments({ 
        farmer: farmerId, 
        status: 'pending' 
      }),
      
      // Recent orders (last 5)
      Order.find({ farmer: farmerId })
        .populate('buyer', 'profile.firstName profile.lastName profile.phone profile.avatar')
        .sort({ createdAt: -1 })
        .limit(5),
      
      // Low stock products (quantity < 10)
      Product.countDocuments({ 
        farmer: farmerId, 
        quantity: { $lt: 10 },
        status: 'available'
      })
    ]);
    
    // Get earnings data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const earningsData = await Order.aggregate([
      { 
        $match: { 
          farmer: new mongoose.Types.ObjectId(farmerId), 
          status: 'delivered',
          paymentStatus: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      { 
        $group: { 
          _id: null, 
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        } 
      }
    ]);
    
    // Get weekly sales data
    const weeklySales = await Order.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(farmerId),
          status: 'delivered',
          paymentStatus: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { 
            week: { $week: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ]);

    const totalRevenue = earningsData.length > 0 ? earningsData[0].totalRevenue : 0;
    const deliveredOrders = earningsData.length > 0 ? earningsData[0].orderCount : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeOrders,
          pendingOrders,
          lowStockProducts,
          deliveredOrders,
          totalRevenue
        },
        recentOrders,
        weeklySales,
        quickStats: {
          averageOrderValue: deliveredOrders > 0 ? totalRevenue / deliveredOrders : 0,
          completionRate: pendingOrders > 0 ? 
            (deliveredOrders / (deliveredOrders + pendingOrders)) * 100 : 100
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// @desc    Get farmer products with pagination and filtering
// @route   GET /api/farmer/products
// @access  Private (Farmer only)
exports.getProducts = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = { farmer: farmerId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    // Get product statistics
    const productStats = await Product.aggregate([
      { $match: { farmer: new mongoose.Types.ObjectId(farmerId) } },
      { 
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        stats: productStats
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/farmer/products/:id
// @access  Private (Farmer only)
exports.getProduct = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const productId = req.params.id;

    const product = await Product.findOne({ 
      _id: productId, 
      farmer: farmerId 
    }).populate('farmer', 'profile.firstName profile.lastName profile.businessName');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Add new product
// @route   POST /api/farmer/products
// @access  Private (Farmer only)
exports.addProduct = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'price', 'unit', 'quantity', 'harvestDate'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Validate price and quantity
    if (req.body.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }
    
    if (req.body.quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }
    
    // Create product with farmer ID
    const productData = {
      ...req.body,
      farmer: farmerId,
      status: req.body.quantity > 0 ? 'available' : 'draft'
    };
    
    const product = new Product(productData);
    await product.save();
    
    // Populate farmer details for response
    await product.populate('farmer', 'profile.firstName profile.lastName profile.businessName');
    
    // Update farmer stats
    const farmer = await User.findById(farmerId);
    if (farmer) {
      farmer.stats.totalProducts += 1;
      if (product.status === 'available') {
        farmer.stats.activeListings += 1;
      }
      await farmer.save();
    }
    
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product
    });
  } catch (error) {
    console.error('Add product error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error adding product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/farmer/products/:id
// @access  Private (Farmer only)
exports.updateProduct = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const productId = req.params.id;
    
    // Find product and verify ownership
    const product = await Product.findOne({ _id: productId, farmer: farmerId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or access denied'
      });
    }
    
    // Update product fields
    const allowedUpdates = [
      'name', 'description', 'category', 'price', 'unit', 'quantity', 
      'minOrder', 'qualityGrade', 'isOrganic', 'harvestDate', 'expiryDate',
      'storageInstructions', 'tags', 'images', 'bulkDiscount'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });
    
    // Update status based on quantity
    if (req.body.quantity !== undefined) {
      product.status = req.body.quantity > 0 ? 'available' : 'sold_out';
    }
    
    await product.save();
    await product.populate('farmer', 'profile.firstName profile.lastName profile.businessName');
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/farmer/products/:id
// @access  Private (Farmer only)
exports.deleteProduct = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const productId = req.params.id;
    
    // Find product and verify ownership
    const product = await Product.findOne({ _id: productId, farmer: farmerId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or access denied'
      });
    }
    
    // Check if product has active orders
    const activeOrders = await Order.countDocuments({
      'items.product': productId,
      status: { $in: ['pending', 'confirmed', 'preparing', 'ready', 'shipped'] }
    });
    
    if (activeOrders > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product with active orders'
      });
    }
    
    // Soft delete by updating status
    product.status = 'deleted';
    await product.save();
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Get farmer orders
// @route   GET /api/farmer/orders
// @access  Private (Farmer only)
exports.getOrders = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const { 
      page = 1, 
      limit = 10, 
      status,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = { farmer: farmerId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    
    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const orders = await Order.find(query)
      .populate('buyer', 'profile.firstName profile.lastName profile.phone profile.avatar profile.businessName')
      .populate('items.product', 'name category unit images')
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    // Get order statistics
    const orderStats = await Order.aggregate([
      { $match: { farmer: new mongoose.Types.ObjectId(farmerId) } },
      { 
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        stats: orderStats
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/farmer/orders/:id
// @access  Private (Farmer only)
exports.getOrder = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const orderId = req.params.id;

    const order = await Order.findOne({ 
      _id: orderId, 
      farmer: farmerId 
    })
    .populate('buyer', 'profile.firstName profile.lastName profile.phone profile.avatar profile.businessName')
    .populate('items.product', 'name category unit images price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Create order (placeholder)
// @route   POST /api/farmer/orders
// @access  Private (Farmer only)
exports.createOrder = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Create order endpoint not implemented'
  });
};

// @desc    Cancel order
// @route   DELETE /api/farmer/orders/:id
// @access  Private (Farmer only)
exports.cancelOrder = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const orderId = req.params.id;
    const { cancellationReason } = req.body;

    const order = await Order.findOne({ 
      _id: orderId, 
      farmer: farmerId 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or access denied'
      });
    }

    // Update order status to cancelled
    order.status = 'cancelled';
    order.cancellationReason = cancellationReason;
    order.cancelledBy = 'farmer';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/farmer/orders/:id
// @access  Private (Farmer only)
exports.updateOrderStatus = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const orderId = req.params.id;
    const { status, notes, cancellationReason } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    // Find order and verify ownership
    const order = await Order.findOne({ _id: orderId, farmer: farmerId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or access denied'
      });
    }
    
    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'cancelled': [] // No transitions from cancelled
    };
    
    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${order.status} to ${status}`
      });
    }
    
    // Update order status
    await order.updateStatus(status, notes);
    
    // Handle cancellation
    if (status === 'cancelled') {
      order.cancellationReason = cancellationReason;
      order.cancelledBy = 'farmer';
      await order.save();
    }
    
    // Populate for response
    await order.populate('buyer', 'profile.firstName profile.lastName profile.phone');
    await order.populate('items.product', 'name category unit');
    
    res.json({
      success: true,
      message: `Order ${status} successfully`,
      data: order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

// @desc    Get farmer analytics
// @route   GET /api/farmer/analytics
// @access  Private (Farmer only)
exports.getAnalytics = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const { period = '30d' } = req.query; // 7d, 30d, 90d, 1y
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default: // 30d
        startDate.setDate(now.getDate() - 30);
    }
    
    // Sales analytics
    const salesAnalytics = await Order.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(farmerId),
          status: 'delivered',
          paymentStatus: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
          averageOrderValue: { $avg: "$totalAmount" }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);
    
    // Product performance
    const productPerformance = await Order.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(farmerId),
          status: 'delivered',
          paymentStatus: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$items.productSnapshot.name" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalPrice" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);
    
    // Category performance
    const categoryPerformance = await Order.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(farmerId),
          status: 'delivered',
          paymentStatus: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productSnapshot.category",
          totalRevenue: { $sum: "$items.totalPrice" },
          totalSold: { $sum: "$items.quantity" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);
    
    // Customer analytics
    const customerAnalytics = await Order.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(farmerId),
          status: 'delivered',
          paymentStatus: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$buyer",
          totalSpent: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
          firstOrder: { $min: "$createdAt" },
          lastOrder: { $max: "$createdAt" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate customer names
    await Order.populate(customerAnalytics, {
      path: '_id',
      select: 'profile.firstName profile.lastName profile.businessName profile.avatar'
    });
    
    res.json({
      success: true,
      data: {
        salesAnalytics,
        productPerformance,
        categoryPerformance,
        customerAnalytics,
        period,
        dateRange: {
          start: startDate,
          end: now
        }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// @desc    Get farmer profile
// @route   GET /api/farmer/profile
// @access  Private (Farmer only)
exports.getProfile = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    
    const farmer = await User.findById(farmerId)
      .select('-password')
      .populate('preferences.preferredBuyers', 'profile.firstName profile.lastName profile.businessName profile.avatar');
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }
    
    res.json({
      success: true,
      data: farmer
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update farmer profile
// @route   PUT /api/farmer/profile
// @access  Private (Farmer only)
exports.updateProfile = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    
    const allowedUpdates = [
      'profile.firstName', 'profile.lastName', 'profile.phone', 'profile.businessName',
      'profile.location', 'profile.bio', 'profile.avatar',
      'farmerProfile', 'business', 'preferences', 'settings'
    ];
    
    const updateData = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        // Handle nested fields
        const fieldParts = field.split('.');
        if (fieldParts.length === 2) {
          if (!updateData[fieldParts[0]]) updateData[fieldParts[0]] = {};
          updateData[fieldParts[0]][fieldParts[1]] = req.body[field];
        } else {
          updateData[field] = req.body[field];
        }
      }
    });
    
    const farmer = await User.findByIdAndUpdate(
      farmerId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: farmer
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Get inventory
// @route   GET /api/farmer/inventory
// @access  Private (Farmer only)
exports.getInventory = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    
    const inventory = await Product.find({ farmer: farmerId })
      .select('name category quantity price status harvestDate expiryDate')
      .sort({ quantity: 1, name: 1 });

    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory',
      error: error.message
    });
  }
};

// @desc    Update inventory
// @route   PUT /api/farmer/inventory/:productId
// @access  Private (Farmer only)
exports.updateInventory = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const productId = req.params.productId;
    const { quantity } = req.body;

    const product = await Product.findOne({ _id: productId, farmer: farmerId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.quantity = quantity;
    product.status = quantity > 0 ? 'available' : 'sold_out';
    await product.save();

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating inventory',
      error: error.message
    });
  }
};

// @desc    Get sales
// @route   GET /api/farmer/sales
// @access  Private (Farmer only)
exports.getSales = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const { period = '30d' } = req.query;

    let startDate = new Date();
    switch (period) {
      case '7d': startDate.setDate(startDate.getDate() - 7); break;
      case '90d': startDate.setDate(startDate.getDate() - 90); break;
      case '1y': startDate.setFullYear(startDate.getFullYear() - 1); break;
      default: startDate.setDate(startDate.getDate() - 30);
    }

    const sales = await Order.find({
      farmer: farmerId,
      status: 'delivered',
      paymentStatus: 'completed',
      createdAt: { $gte: startDate }
    })
    .populate('buyer', 'profile.firstName profile.lastName profile.businessName')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: sales
    });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales',
      error: error.message
    });
  }
};

// @desc    Get sales analytics
// @route   GET /api/farmer/sales/analytics
// @access  Private (Farmer only)
exports.getSalesAnalytics = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    
    const analytics = await Order.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(farmerId),
          status: 'delivered',
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: analytics[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 }
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales analytics',
      error: error.message
    });
  }
};

// @desc    Get payments
// @route   GET /api/farmer/payments
// @access  Private (Farmer only)
exports.getPayments = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    
    const payments = await Order.find({
      farmer: farmerId,
      paymentStatus: 'paid'
    })
    .select('orderNumber totalAmount paymentStatus createdAt')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

// @desc    Get payment
// @route   GET /api/farmer/payments/:id
// @access  Private (Farmer only)
exports.getPayment = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const farmerId = req.user._id;
    const orderId = req.params.id;

    const payment = await Order.findOne({
      _id: orderId,
      farmer: farmerId
    })
    .populate('buyer', 'profile.firstName profile.lastName profile.businessName');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    });
  }
};