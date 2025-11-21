const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Review = require('../models/Review');
const mongoose = require('mongoose');

// @desc    Get buyer dashboard overview
// @route   GET /api/buyer/dashboard
// @access  Private (Buyer only)
exports.getDashboard = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const [
      activeOrders,
      totalSpent,
      favoriteSuppliers,
      recentOrders,
      recommendedProducts
    ] = await Promise.all([
      // Active orders
      Order.countDocuments({ 
        buyer: buyerId, 
        status: { $in: ['pending', 'confirmed', 'paid', 'preparing', 'ready', 'shipped'] } 
      }),
      
      // Total spent
      Order.aggregate([
        { 
          $match: { 
            buyer: new mongoose.Types.ObjectId(buyerId), 
            status: 'delivered',
            paymentStatus: 'completed'
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Favorite suppliers (farmers with most orders) - FIXED
      Order.aggregate([
        { $match: { buyer: new mongoose.Types.ObjectId(buyerId) } },
        { $group: { _id: '$farmer', orderCount: { $sum: 1 } } },
        { $sort: { orderCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users', // ✅ CHANGED to 'users' collection
            localField: '_id',
            foreignField: '_id',
            as: 'farmer'
          }
        },
        { $unwind: '$farmer' }
      ]),
      
      // Recent orders - FIXED POPULATE
      Order.find({ buyer: buyerId })
        .populate('farmer', 'profile.firstName profile.lastName profile.businessName farmerProfile.farmName profile.location') // ✅ FIXED: Use User model fields
        .sort({ createdAt: -1 })
        .limit(5),
      
      // Recommended products - FIXED POPULATE
      Product.find({ 
        status: 'available',
        quantity: { $gt: 0 }
      })
      .populate('farmer', 'profile.firstName profile.lastName profile.businessName farmerProfile.farmName profile.location farmerProfile.farmSize') // ✅ FIXED: Use User model fields
      .sort({ 'stats.views': -1 })
      .limit(8)
    ]);

    const totalSpentAmount = totalSpent.length > 0 ? totalSpent[0].total : 0;

    // Additional counts for quick stats
    const [completedOrders, pendingReviews, wishlistItems] = await Promise.all([
      Order.countDocuments({ 
        buyer: buyerId, 
        status: 'delivered' 
      }),
      Review.countDocuments({ 
        buyer: buyerId, 
        status: 'pending' 
      }),
      Wishlist.countDocuments({ buyer: buyerId })
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          activeOrders,
          totalSpent: totalSpentAmount,
          favoriteSuppliersCount: favoriteSuppliers.length,
          cartItems: 0
        },
        recentOrders,
        favoriteSuppliers,
        recommendedProducts,
        quickStats: {
          completedOrders,
          pendingReviews,
          wishlistItems
        }
      }
    });
  } catch (error) {
    console.error('Buyer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching buyer dashboard data',
      error: error.message
    });
  }
};

// @desc    Browse products with search and filters
// @route   GET /api/buyer/products
// @access  Private (Buyer only)
exports.browseProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      farmer,
      qualityGrade,
      organicOnly
    } = req.query;

    // Build query
    const query = { 
      status: 'available',
      quantity: { $gt: 0 }
    };

    // Search in name, description, tags
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (location) {
      query['location.county'] = { $regex: location, $options: 'i' };
    }

    if (farmer) {
      query.farmer = farmer;
    }

    if (qualityGrade) {
      query.qualityGrade = qualityGrade;
    }

    if (organicOnly === 'true') {
      query.isOrganic = true;
    }

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination - FIXED POPULATE
    const products = await Product.find(query)
      .populate('farmer', 'profile.firstName profile.lastName profile.businessName farmerProfile.farmName profile.location farmerProfile.farmSize farmerProfile.mainCrops') // ✅ FIXED: Use User model fields
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    // Get categories for filters
    const categories = await Product.distinct('category', { 
      status: 'available',
      quantity: { $gt: 0 }
    });

    // Get price range for filters
    const priceRange = await Product.aggregate([
      { $match: { status: 'available', quantity: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
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
        filters: {
          categories,
          priceRange: priceRange.length > 0 ? priceRange[0] : { minPrice: 0, maxPrice: 1000 }
        }
      }
    });
  } catch (error) {
    console.error('Browse products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get product details
// @route   GET /api/buyer/products/:id
// @access  Private (Buyer only)
exports.getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;

    // FIXED POPULATE
    const product = await Product.findById(productId)
      .populate('farmer', 'profile.firstName profile.lastName profile.businessName profile.phone farmerProfile.farmName farmerProfile.farmSize farmerProfile.mainCrops farmerProfile.farmingExperience stats.customerRating reviewCount'); // ✅ FIXED: Use User model fields

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment product views
    product.stats.views += 1;
    await product.save();

    // Get similar products - FIXED POPULATE
    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: productId },
      status: 'available',
      quantity: { $gt: 0 }
    })
    .populate('farmer', 'profile.firstName profile.lastName profile.businessName profile.avatar') // ✅ FIXED: Use User model fields
    .limit(4);

    // Get product reviews
    const reviews = await Review.find({ product: productId })
      .populate('buyer', 'profile.firstName profile.lastName profile.avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        product,
        similarProducts,
        reviews
      }
    });
  } catch (error) {
    console.error('Product details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product details',
      error: error.message
    });
  }
};

// @desc    Place a new order
// @route   POST /api/buyer/orders
// @access  Private (Buyer only)
exports.placeOrder = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { items, deliveryMethod, deliveryAddress, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      if (product.status !== 'available') {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${product.name}. Available: ${product.quantity}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
        productSnapshot: {
          name: product.name,
          category: product.category,
          unit: product.unit,
          images: product.images
        }
      });
    }

    // Create order
    const order = new Order({
      buyer: buyerId,
      farmer: orderItems[0].product.farmer,
      items: orderItems,
      subtotal,
      totalAmount: subtotal,
      deliveryMethod,
      deliveryAddress,
      notes: { buyer: notes }
    });

    await order.save();

    // Update product quantities
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    // Populate for response - FIXED POPULATE
    await order.populate('farmer', 'profile.firstName profile.lastName profile.businessName farmerProfile.farmName profile.location'); // ✅ FIXED: Use User model fields
    await order.populate('items.product', 'name category unit');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order,
        paymentRequired: true,
        totalAmount: order.totalAmount
      }
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    });
  }
};

// @desc    Get buyer orders
// @route   GET /api/buyer/orders
// @access  Private (Buyer only)
exports.getOrders = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { 
      page = 1, 
      limit = 10, 
      status,
      dateFrom,
      dateTo 
    } = req.query;

    const query = { buyer: buyerId };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // FIXED POPULATE
    const orders = await Order.find(query)
      .populate('farmer', 'profile.firstName profile.lastName profile.businessName profile.avatar profile.phone') // ✅ FIXED: Use User model fields
      .populate('items.product', 'name category unit images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // Order statistics
    const orderStats = await Order.aggregate([
      { $match: { buyer: new mongoose.Types.ObjectId(buyerId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
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

// @desc    Manage wishlist
// @route   GET /api/buyer/wishlist
// @access  Private (Buyer only)
exports.getWishlist = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const wishlist = await Wishlist.findOne({ buyer: buyerId })
      .populate('items.product', 'name price unit images category farmer location')
      .populate('items.product.farmer', 'profile.firstName profile.lastName profile.businessName profile.avatar'); // ✅ FIXED: Use User model fields

    res.json({
      success: true,
      data: wishlist || { items: [] }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
};

// @desc    Add to wishlist
// @route   POST /api/buyer/wishlist
// @access  Private (Buyer only)
exports.addToWishlist = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { productId, notes } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let wishlist = await Wishlist.findOne({ buyer: buyerId });

    if (!wishlist) {
      wishlist = new Wishlist({
        buyer: buyerId,
        items: []
      });
    }

    // Check if product already in wishlist
    const existingItem = wishlist.items.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    wishlist.items.push({
      product: productId,
      notes
    });

    await wishlist.save();

    await wishlist.populate('items.product', 'name price unit images category');

    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist',
      error: error.message
    });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/buyer/wishlist/:productId
// @access  Private (Buyer only)
exports.removeFromWishlist = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ buyer: buyerId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.items = wishlist.items.filter(item => 
      item.product.toString() !== productId
    );

    await wishlist.save();

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist',
      error: error.message
    });
  }
};

// @desc    Get buyer notifications
// @route   GET /api/buyer/notifications
// @access  Private (Buyer only)
exports.getNotifications = async (req, res) => {
  try {
    const buyerId = req.user._id;

    // Mock notifications data
    const notifications = [
      {
        id: 1,
        type: 'order_update',
        title: 'Order Shipped',
        message: 'Your order ORD-001 has been shipped and is on the way',
        time: '2 hours ago',
        read: false,
        orderId: 'ORD-001'
      },
      {
        id: 2,
        type: 'price_alert',
        title: 'Price Drop Alert',
        message: 'Maize prices decreased by 8% in your region',
        time: '5 hours ago',
        read: false,
        productId: 'prod123'
      },
      {
        id: 3,
        type: 'new_product',
        title: 'New Products Available',
        message: 'Fresh tomatoes and onions from local farmers',
        time: '1 day ago',
        read: true
      },
      {
        id: 4,
        type: 'delivery_update',
        title: 'Delivery Arriving Today',
        message: 'Your order ORD-002 will be delivered between 2-4 PM',
        time: '3 hours ago',
        read: false,
        orderId: 'ORD-002'
      },
      {
        id: 5,
        type: 'payment_success',
        title: 'Payment Confirmed',
        message: 'Your payment of KES 5,400 for order ORD-003 has been confirmed',
        time: '1 day ago',
        read: true,
        orderId: 'ORD-003'
      }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        total: notifications.length
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};