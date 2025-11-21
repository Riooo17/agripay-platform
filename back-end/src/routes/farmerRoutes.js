const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Expert = require('../models/Expert');
const Consultation = require('../models/Consultation');
const CommunityPost = require('../models/CommunityPost');
const MarketInsight = require('../models/MarketInsight');
const mongoose = require('mongoose');

// =============================================
// ✅ DASHBOARD DATA API - FIXED OBJECTID ERROR
// =============================================
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    console.log('📊 Fetching dashboard for farmer:', req.user._id);

    // Check if user is a farmer
    if (req.user.role !== 'farmer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Farmer role required.'
      });
    }

    // FIX: Use User model instead of Farmer model
    const farmer = await User.findById(req.user._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Ensure farmer has required profile data
    if (!farmer.farmerProfile) {
      farmer.farmerProfile = {
        farmName: `${farmer.profile.firstName}'s Farm`,
        farmSize: { value: 5, unit: 'acres' },
        mainCrops: ['maize', 'vegetables'],
        farmingExperience: 2
      };
      await farmer.save();
    }

    // Ensure farmer has stats
    if (!farmer.stats) {
      farmer.stats = {
        totalProducts: 0,
        activeListings: 0,
        completedOrders: 0,
        totalRevenue: 0,
        customerRating: 0,
        reviewCount: 0
      };
      await farmer.save();
    }

    // 🚀 FIX: Use new keyword for ObjectId
    const farmerId = new mongoose.Types.ObjectId(req.user._id);

    // Get real dashboard stats
    const totalProducts = await Product.countDocuments({ 
      farmer: req.user._id, 
      isActive: true 
    });
    
    const pendingOrders = await Order.countDocuments({ 
      farmer: req.user._id, 
      status: 'pending' 
    });
    
    const completedOrders = await Order.countDocuments({ 
      farmer: req.user._id, 
      status: 'completed' 
    });

    // Calculate real earnings from completed orders
    const earningsResult = await Order.aggregate([
      { 
        $match: { 
          farmer: farmerId, 
          status: 'completed' 
        } 
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get real recent orders
    const recentOrders = await Order.find({ farmer: req.user._id })
      .populate('customer', 'name email phone')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Update farmer stats with real data
    farmer.stats.totalProducts = totalProducts;
    farmer.stats.completedOrders = completedOrders;
    farmer.stats.totalRevenue = earningsResult[0]?.totalEarnings || 0;
    await farmer.save();

    res.json({
      success: true,
      farmer: {
        id: farmer._id,
        name: farmer.profile.firstName + ' ' + farmer.profile.lastName,
        email: farmer.email,
        farmName: farmer.farmerProfile.farmName,
        location: farmer.profile.location?.address || 'Location not set',
        joinDate: farmer.createdAt,
        farmSize: farmer.farmerProfile.farmSize,
        mainCrops: farmer.farmerProfile.mainCrops,
        experience: farmer.farmerProfile.farmingExperience
      },
      stats: {
        totalProducts,
        pendingOrders,
        completedOrders,
        totalEarnings: earningsResult[0]?.totalEarnings || 0,
        customerRating: farmer.stats.customerRating,
        activeListings: farmer.stats.activeListings
      },
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        customerName: order.customer?.name || 'Customer',
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items?.map(item => ({
          productName: item.product?.name,
          quantity: item.quantity,
          price: item.price
        }))
      })),
      message: 'Dashboard loaded successfully'
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error loading dashboard'
    });
  }
});

// =============================================
// ✅ PRODUCTS MANAGEMENT APIS
// =============================================

// GET all farmer products
router.get('/products', authenticate, async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = req.query;
    
    let query = { farmer: req.user._id };
    
    // Apply filters
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load products'
    });
  }
});

// CREATE new product
router.post('/products', authenticate, async (req, res) => {
  try {
    const { name, description, price, category, stock, unit, image } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !stock || !unit) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      unit,
      image: image || '',
      farmer: req.user._id,
      isActive: true
    });

    await product.save();

    // Update farmer stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalProducts': 1, 'stats.activeListings': 1 }
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product data',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// UPDATE product
router.put('/products/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find product and verify ownership
    const product = await Product.findOne({ _id: id, farmer: req.user._id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        product[key] = updateData[key];
      }
    });

    await product.save();

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// DELETE product
router.delete('/products/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Find product and verify ownership
    const product = await Product.findOne({ _id: id, farmer: req.user._id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(id);

    // Update farmer stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalProducts': -1, 'stats.activeListings': -1 }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

// =============================================
// ✅ ORDERS MANAGEMENT APIS
// =============================================

// GET all farmer orders
router.get('/orders', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { farmer: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load orders'
    });
  }
});

// GET single order details
router.get('/orders/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, farmer: req.user._id })
      .populate('customer', 'name email phone address')
      .populate('items.product');

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
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load order details'
    });
  }
});

// UPDATE order status
router.patch('/orders/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Valid status transitions
    const validStatuses = ['pending', 'accepted', 'in_transit', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findOne({ _id: id, farmer: req.user._id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    const oldStatus = order.status;
    order.status = status;
    
    // If order is completed, create transaction record and update stats
    if (status === 'completed' && oldStatus !== 'completed') {
      const transaction = new Transaction({
        farmer: req.user._id,
        order: order._id,
        type: 'credit',
        amount: order.totalAmount,
        description: `Order payment - ${order._id}`,
        status: 'completed'
      });
      await transaction.save();

      // Update farmer stats
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 'stats.completedOrders': 1, 'stats.totalRevenue': order.totalAmount }
      });
    }

    await order.save();

    res.json({
      success: true,
      data: order,
      message: `Order ${status} successfully`
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// =============================================
// ✅ PROFILE MANAGEMENT APIS
// =============================================

// GET farmer profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const farmer = await User.findById(req.user._id).select('-password');
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: farmer._id,
        name: farmer.profile.firstName + ' ' + farmer.profile.lastName,
        email: farmer.email,
        farmName: farmer.farmerProfile?.farmName,
        contact: farmer.profile.phone,
        location: farmer.profile.location,
        farmSize: farmer.farmerProfile?.farmSize,
        crops: farmer.farmerProfile?.mainCrops || [],
        experience: farmer.farmerProfile?.farmingExperience,
        stats: farmer.stats,
        preferences: farmer.preferences,
        createdAt: farmer.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load profile'
    });
  }
});

// UPDATE farmer profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { farmName, name, contact, location, farmSize, crops, experience, preferences } = req.body;

    const farmer = await User.findById(req.user._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Update basic profile
    if (name) {
      const [firstName, ...lastNameParts] = name.split(' ');
      farmer.profile.firstName = firstName;
      farmer.profile.lastName = lastNameParts.join(' ') || '';
    }
    if (contact) farmer.profile.phone = contact;
    if (location) farmer.profile.location = location;

    // Update farmer profile
    if (!farmer.farmerProfile) farmer.farmerProfile = {};
    if (farmName) farmer.farmerProfile.farmName = farmName;
    if (farmSize) farmer.farmerProfile.farmSize = farmSize;
    if (crops) farmer.farmerProfile.mainCrops = crops;
    if (experience) farmer.farmerProfile.farmingExperience = experience;

    // Update preferences
    if (preferences) farmer.preferences = { ...farmer.preferences, ...preferences };

    await farmer.save();

    res.json({
      success: true,
      data: {
        id: farmer._id,
        name: farmer.profile.firstName + ' ' + farmer.profile.lastName,
        email: farmer.email,
        farmName: farmer.farmerProfile.farmName,
        contact: farmer.profile.phone,
        location: farmer.profile.location,
        farmSize: farmer.farmerProfile.farmSize,
        crops: farmer.farmerProfile.mainCrops,
        experience: farmer.farmerProfile.farmingExperience,
        stats: farmer.stats,
        preferences: farmer.preferences
      },
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// =============================================
// ✅ FINANCIAL APIS
// =============================================

// GET farmer transactions
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    
    let query = { farmer: req.user._id };
    
    if (type && type !== 'all') {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .populate('order')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    // Calculate summary
    const creditTotal = await Transaction.aggregate([
      { $match: { farmer: new mongoose.Types.ObjectId(req.user._id), type: 'credit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const debitTotal = await Transaction.aggregate([
      { $match: { farmer: new mongoose.Types.ObjectId(req.user._id), type: 'debit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: transactions,
      summary: {
        totalEarnings: creditTotal[0]?.total || 0,
        totalExpenses: debitTotal[0]?.total || 0,
        netProfit: (creditTotal[0]?.total || 0) - (debitTotal[0]?.total || 0)
      },
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load transactions'
    });
  }
});

// REQUEST payout
router.post('/payout-request', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Calculate available balance from completed orders
    const earningsResult = await Order.aggregate([
      { 
        $match: { 
          farmer: new mongoose.Types.ObjectId(req.user._id), 
          status: 'completed' 
        } 
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalEarnings = earningsResult[0]?.totalEarnings || 0;

    // Check if payout amount is valid
    if (amount > totalEarnings) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance for payout'
      });
    }

    // Create payout transaction
    const transaction = new Transaction({
      farmer: req.user._id,
      type: 'debit',
      amount: parseFloat(amount),
      description: 'Payout request',
      status: 'pending',
      metadata: {
        payoutRequest: true,
        requestDate: new Date()
      }
    });

    await transaction.save();

    res.json({
      success: true,
      data: transaction,
      message: 'Payout request submitted successfully. It will be processed within 3-5 business days.'
    });

  } catch (error) {
    console.error('Payout request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payout request'
    });
  }
});

// =============================================
// ✅ EXPERT CONNECT APIS
// =============================================

// GET available experts
router.get('/experts', authenticate, async (req, res) => {
  try {
    const { specialization, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (specialization) {
      query.specialization = specialization;
    }

    const experts = await Expert.find(query)
      .select('name specialization bio experience rating reviews consultationsCompleted responseTime fee skills')
      .sort({ rating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expert.countDocuments(query);

    res.json({
      success: true,
      data: experts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get experts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load experts'
    });
  }
});

// GET farmer consultations
router.get('/consultations', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { farmer: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const consultations = await Consultation.find(query)
      .populate('expert', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Consultation.countDocuments(query);

    res.json({
      success: true,
      data: consultations,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load consultations'
    });
  }
});

// CREATE consultation request
router.post('/consultations', authenticate, async (req, res) => {
  try {
    const { expertId, subject, description, urgency, preferredDate, preferredTime, budget } = req.body;

    if (!expertId || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Expert, subject, and description are required'
      });
    }

    // Verify expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    const consultation = new Consultation({
      farmer: req.user._id,
      expert: expertId,
      subject,
      description,
      urgency: urgency || 'medium',
      preferredDate,
      preferredTime,
      budget: budget ? parseFloat(budget) : expert.fee,
      status: 'pending'
    });

    await consultation.save();

    // Populate expert details in response
    await consultation.populate('expert', 'name specialization fee');

    res.status(201).json({
      success: true,
      data: consultation,
      message: 'Consultation request submitted successfully'
    });

  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create consultation request'
    });
  }
});

// =============================================
// ✅ COMMUNITY APIS
// =============================================

// GET community posts
router.get('/community-posts', authenticate, async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const posts = await CommunityPost.find(query)
      .populate('author', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CommunityPost.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get community posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load community posts'
    });
  }
});

// CREATE community post
router.post('/community-posts', authenticate, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and category are required'
      });
    }

    const post = new CommunityPost({
      title,
      content,
      category,
      tags: tags || [],
      author: req.user._id,
      likes: 0,
      comments: []
    });

    await post.save();

    // Populate author details
    await post.populate('author', 'name');

    res.status(201).json({
      success: true,
      data: post,
      message: 'Post created successfully'
    });

  } catch (error) {
    console.error('Create community post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
});

module.exports = router;