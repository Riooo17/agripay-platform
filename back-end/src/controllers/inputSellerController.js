const InputProduct = require('../models/InputProduct');
const InputOrder = require('../models/InputOrder');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get input seller dashboard overview
// @route   GET /api/input-seller/dashboard
// @access  Private (Input Seller only)
exports.getDashboard = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const sellerId = req.user._id;
    
    // Execute all queries in parallel for better performance
    const [
      totalProducts,
      activeOrders,
      totalRevenue,
      lowStockItems,
      recentOrders,
      topProducts
    ] = await Promise.all([
      // Total products
      InputProduct.countDocuments({ seller: sellerId }),
      
      // Active orders
      InputOrder.countDocuments({ 
        seller: sellerId, 
        status: { $in: ['pending', 'confirmed', 'processing', 'ready', 'shipped', 'out_for_delivery'] } 
      }),
      
      // Total revenue (last 30 days) - FIXED: Proper aggregation
      InputOrder.aggregate([
        { 
          $match: { 
            seller: new mongoose.Types.ObjectId(sellerId),
            status: 'delivered',
            paymentStatus: 'completed',
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Low stock items - FIXED: Use constant threshold instead of undefined variable
      InputProduct.countDocuments({ 
        seller: sellerId, 
        stock: { $lt: 10 }, // Fixed: Using constant value 10
        status: 'active'
      }),
      
      // Recent orders
      InputOrder.find({ seller: sellerId })
        .populate('customer', 'profile.firstName profile.lastName profile.phone profile.avatar')
        .sort({ createdAt: -1 })
        .limit(5),
      
      // Top selling products
      InputOrder.aggregate([
        { 
          $match: { 
            seller: new mongoose.Types.ObjectId(sellerId),
            status: 'delivered'
          } 
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            productName: { $first: '$items.productSnapshot.name' },
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: '$items.totalPrice' }
          }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 }
      ])
    ]);

    // Sales data for charts (last 7 days)
    const salesData = await InputOrder.aggregate([
      {
        $match: {
          seller: new mongoose.Types.ObjectId(sellerId),
          status: 'delivered',
          paymentStatus: 'completed',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
          averageOrder: { $avg: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const totalRevenueAmount = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    const completedOrders = await InputOrder.countDocuments({ 
      seller: sellerId, 
      status: 'delivered' 
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeOrders,
          totalRevenue: totalRevenueAmount,
          lowStockItems,
          completedOrders
        },
        recentOrders,
        topProducts,
        salesData,
        quickStats: {
          conversionRate: '12.5%',
          customerSatisfaction: '4.8/5',
          averageDeliveryTime: '2.3 days'
        }
      }
    });
  } catch (error) {
    console.error('Input seller dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// @desc    Get input seller products
// @route   GET /api/input-seller/products
// @access  Private (Input Seller only)
exports.getProducts = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const sellerId = req.user._id;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      lowStockOnly = false
    } = req.query;
    
    // Build query
    const query = { seller: sellerId };
    
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
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // FIXED: Use constant threshold instead of undefined variable
    if (lowStockOnly === 'true') {
      query.stock = { $lt: 10 }; // Fixed: Using constant value 10
    }
    
    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const products = await InputProduct.find(query)
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await InputProduct.countDocuments(query);
    
    // Get product statistics
    const productStats = await InputProduct.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
      { 
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);

    // Get categories for filters
    const categories = await InputProduct.distinct('category', { seller: sellerId });

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
        filters: {
          categories,
          statuses: ['active', 'inactive', 'out_of_stock', 'draft']
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

// @desc    Add new input product
// @route   POST /api/input-seller/products
// @access  Private (Input Seller only)
exports.addProduct = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const sellerId = req.user._id;
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'price', 'unit', 'stock'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Validate price and stock
    if (req.body.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }
    
    if (req.body.stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative'
      });
    }
    
    // Create product with seller ID
    const productData = {
      ...req.body,
      seller: sellerId,
      status: req.body.stock > 0 ? 'active' : 'out_of_stock'
    };
    
    const product = new InputProduct(productData);
    await product.save();
    
    // Populate seller details for response
    await product.populate('seller', 'profile.firstName profile.lastName profile.businessName');
    
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

// @desc    Update input product
// @route   PUT /api/input-seller/products/:id
// @access  Private (Input Seller only)
exports.updateProduct = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const sellerId = req.user._id;
    const productId = req.params.id;
    
    // Find product and verify ownership
    const product = await InputProduct.findOne({ _id: productId, seller: sellerId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or access denied'
      });
    }
    
    // Update product fields
    const allowedUpdates = [
      'name', 'description', 'category', 'price', 'unit', 'stock', 
      'lowStockThreshold', 'brand', 'specifications', 'isOrganic',
      'certifications', 'tags', 'images', 'minOrder', 'originalPrice'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });
    
    // Update status based on quantity
    if (req.body.stock !== undefined) {
      if (req.body.stock > 0 && product.status === 'out_of_stock') {
        product.status = 'active';
      } else if (req.body.stock <= 0 && product.status === 'active') {
        product.status = 'out_of_stock';
      }
    }
    
    await product.save();
    await product.populate('seller', 'profile.firstName profile.lastName profile.businessName');
    
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

// @desc    Delete input product
// @route   DELETE /api/input-seller/products/:id
// @access  Private (Input Seller only)
exports.deleteProduct = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const sellerId = req.user._id;
    const productId = req.params.id;
    
    // Find product and verify ownership
    const product = await InputProduct.findOne({ _id: productId, seller: sellerId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or access denied'
      });
    }
    
    // Check if product has active orders
    const activeOrders = await InputOrder.countDocuments({
      'items.product': productId,
      status: { $in: ['pending', 'confirmed', 'processing', 'ready', 'shipped'] }
    });
    
    if (activeOrders > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product with active orders. Consider deactivating instead.'
      });
    }
    
    await InputProduct.findByIdAndDelete(productId);
    
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

// @desc    Get input seller orders
// @route   GET /api/input-seller/orders
// @access  Private (Input Seller only)
exports.getOrders = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const sellerId = req.user._id;
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
    const query = { seller: sellerId };
    
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
    const orders = await InputOrder.find(query)
      .populate('customer', 'profile.firstName profile.lastName profile.phone profile.avatar profile.businessName')
      .populate('items.product', 'name category brand unit images')
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await InputOrder.countDocuments(query);
    
    // Order statistics
    const orderStats = await InputOrder.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
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

// @desc    Update order status
// @route   PUT /api/input-seller/orders/:id
// @access  Private (Input Seller only)
exports.updateOrderStatus = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const sellerId = req.user._id;
    const orderId = req.params.id;
    const { status, notes, deliveryInfo } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    // Find order and verify ownership
    const order = await InputOrder.findOne({ _id: orderId, seller: sellerId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or access denied'
      });
    }
    
    // Update order status
    order.status = status;
    
    if (notes) {
      order.notes.seller = notes;
    }
    
    if (deliveryInfo && status === 'shipped') {
      order.delivery = { ...order.delivery, ...deliveryInfo };
    }
    
    if (status === 'delivered') {
      order.delivery.actualDelivery = new Date();
    }
    
    await order.save();
    
    // Populate for response
    await order.populate('customer', 'profile.firstName profile.lastName profile.phone');
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

// @desc    Get input seller customers
// @route   GET /api/input-seller/customers
// @access  Private (Input Seller only)
exports.getCustomers = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const sellerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    
    // Get customers who have placed orders
    const customers = await InputOrder.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: '$customer',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit * 1 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' }
    ]);
    
    const total = await InputOrder.distinct('customer', { seller: sellerId });
    
    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total.length / limit),
          totalCustomers: total.length,
          hasNext: page < Math.ceil(total.length / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: error.message
    });
  }
};

// @desc    Get input seller analytics
// @route   GET /api/input-seller/analytics
// @access  Private (Input Seller only)
exports.getAnalytics = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const sellerId = req.user._id;
    const { period = '30d' } = req.query;
    
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
    const salesAnalytics = await InputOrder.aggregate([
      {
        $match: {
          seller: new mongoose.Types.ObjectId(sellerId),
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
    const productPerformance = await InputOrder.aggregate([
      {
        $match: {
          seller: new mongoose.Types.ObjectId(sellerId),
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
    const categoryPerformance = await InputOrder.aggregate([
      {
        $match: {
          seller: new mongoose.Types.ObjectId(sellerId),
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
    const customerAnalytics = await InputOrder.aggregate([
      {
        $match: {
          seller: new mongoose.Types.ObjectId(sellerId),
          status: 'delivered',
          paymentStatus: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$customer",
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
    await InputOrder.populate(customerAnalytics, {
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