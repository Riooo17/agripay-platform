const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const { authenticate } = require('../middleware/auth');

// All routes are protected and require buyer role
router.use(authenticate);

// 🚨 FORCE MOCK DATA - Change this to false when you want real data
const USE_MOCK_DATA = true;

// COMPREHENSIVE MOCK DATA - NO EMPTY SECTIONS!
const mockBuyerData = {
  dashboard: {
    stats: {
      totalOrders: 24,
      pendingOrders: 3,
      completedOrders: 18,
      cancelledOrders: 3,
      totalSpent: 287500,
      favoriteCategory: 'Grains',
      activeContracts: 4,
      walletBalance: 75600,
      savedAmount: 12500,
      favoriteFarmers: 8
    },
    recentOrders: [
      {
        _id: 'order1',
        orderId: 'ORD001',
        product: {
          name: 'Maize Grade 1',
          category: 'Grains',
          quantity: { value: 100, unit: 'kg' },
          pricePerUnit: 50,
          image: '/images/maize.jpg'
        },
        farmer: {
          name: 'John Kamau',
          location: 'Nakuru',
          rating: 4.5,
          phone: '254712345678'
        },
        totalAmount: 5000,
        status: 'delivered',
        orderDate: '2024-01-15T10:30:00Z',
        deliveryDate: '2024-01-20T14:00:00Z',
        trackingId: 'TRK001'
      },
      {
        _id: 'order2',
        orderId: 'ORD002',
        product: {
          name: 'Beans Mwezi Moja',
          category: 'Pulses',
          quantity: { value: 50, unit: 'kg' },
          pricePerUnit: 120,
          image: '/images/beans.jpg'
        },
        farmer: {
          name: 'Mary Wanjiku',
          location: 'Kiambu',
          rating: 4.2,
          phone: '254723456789'
        },
        totalAmount: 6000,
        status: 'in_transit',
        orderDate: '2024-01-18T09:15:00Z',
        estimatedDelivery: '2024-01-25T00:00:00Z',
        trackingId: 'TRK002'
      },
      {
        _id: 'order3',
        orderId: 'ORD003',
        product: {
          name: 'Rice Pishori',
          category: 'Grains',
          quantity: { value: 75, unit: 'kg' },
          pricePerUnit: 180,
          image: '/images/rice.jpg'
        },
        farmer: {
          name: 'Mwea Rice Coop',
          location: 'Kirinyaga',
          rating: 4.8,
          phone: '254734567890'
        },
        totalAmount: 13500,
        status: 'processing',
        orderDate: '2024-01-19T14:20:00Z',
        estimatedDelivery: '2024-01-26T00:00:00Z'
      }
    ],
    recommendedProducts: [
      {
        _id: 'prod4',
        name: 'Wheat Flour Premium',
        category: 'Grains',
        pricePerUnit: 80,
        unit: 'kg',
        farmer: {
          name: 'Kiprono Enterprises',
          location: 'Nakuru',
          rating: 4.7
        },
        minOrder: 25,
        availableQuantity: 500,
        image: '/images/wheat-flour.jpg',
        discount: 10
      },
      {
        _id: 'prod5',
        name: 'Organic Potatoes',
        category: 'Vegetables',
        pricePerUnit: 40,
        unit: 'kg',
        farmer: {
          name: 'Green Valley Farms',
          location: 'Nyandarua',
          rating: 4.8
        },
        minOrder: 50,
        availableQuantity: 1000,
        image: '/images/potatoes.jpg',
        isOrganic: true
      },
      {
        _id: 'prod6',
        name: 'Fresh Carrots',
        category: 'Vegetables',
        pricePerUnit: 35,
        unit: 'kg',
        farmer: {
          name: 'Fresh Produce Co.',
          location: 'Murang\'a',
          rating: 4.6
        },
        minOrder: 30,
        availableQuantity: 800,
        image: '/images/carrots.jpg'
      }
    ],
    quickActions: [
      { label: 'Browse Products', icon: '🛍️', path: '/products' },
      { label: 'Track Orders', icon: '📦', path: '/orders' },
      { label: 'My Wishlist', icon: '❤️', path: '/wishlist' },
      { label: 'Payment Methods', icon: '💳', path: '/payments' }
    ]
  },
  products: [
    {
      _id: 'prod1',
      name: 'Maize Grade 1',
      category: 'Grains',
      description: 'High quality maize suitable for flour production and animal feed. Grown in the fertile lands of Nakuru.',
      pricePerUnit: 50,
      unit: 'kg',
      farmer: {
        _id: 'f1',
        name: 'John Kamau',
        location: 'Nakuru',
        rating: 4.5,
        totalSales: 150,
        joinedDate: '2022-03-15'
      },
      minOrder: 25,
      availableQuantity: 1000,
      images: ['/images/maize1.jpg', '/images/maize2.jpg'],
      specifications: {
        moistureContent: '13%',
        purity: '98%',
        packaging: '50kg bags',
        origin: 'Nakuru County'
      },
      rating: 4.4,
      reviewCount: 28,
      deliveryTime: '3-5 days',
      isAvailable: true,
      tags: ['premium', 'bulk', 'animal-feed']
    },
    {
      _id: 'prod2',
      name: 'Beans Mwezi Moja',
      category: 'Pulses',
      description: 'Fast cooking beans with excellent taste and nutritional value. Perfect for household and commercial use.',
      pricePerUnit: 120,
      unit: 'kg',
      farmer: {
        _id: 'f2',
        name: 'Mary Wanjiku',
        location: 'Kiambu',
        rating: 4.2,
        totalSales: 89,
        joinedDate: '2022-06-20'
      },
      minOrder: 10,
      availableQuantity: 500,
      images: ['/images/beans1.jpg', '/images/beans2.jpg'],
      specifications: {
        cookingTime: '45 minutes',
        color: 'Red',
        packaging: '25kg bags',
        variety: 'Mwezi Moja'
      },
      rating: 4.3,
      reviewCount: 15,
      deliveryTime: '2-4 days',
      isAvailable: true,
      tags: ['fast-cooking', 'nutritious']
    },
    {
      _id: 'prod3',
      name: 'Rice Pishori',
      category: 'Grains',
      description: 'Aromatic long grain rice from Mwea irrigation scheme. Known for its excellent aroma and taste.',
      pricePerUnit: 180,
      unit: 'kg',
      farmer: {
        _id: 'f3',
        name: 'Mwea Rice Farmers Coop',
        location: 'Kirinyaga',
        rating: 4.8,
        totalSales: 320,
        joinedDate: '2021-11-10'
      },
      minOrder: 20,
      availableQuantity: 800,
      images: ['/images/rice1.jpg', '/images/rice2.jpg'],
      specifications: {
        grainLength: 'Long',
        aroma: 'High',
        packaging: '25kg bags',
        origin: 'Mwea Irrigation'
      },
      rating: 4.7,
      reviewCount: 42,
      deliveryTime: '4-6 days',
      isAvailable: true,
      tags: ['aromatic', 'premium', 'kenyan']
    },
    {
      _id: 'prod4',
      name: 'Wheat Flour Premium',
      category: 'Grains',
      description: 'Premium quality wheat flour suitable for baking and cooking. Finely milled for best results.',
      pricePerUnit: 80,
      unit: 'kg',
      farmer: {
        _id: 'f4',
        name: 'Kiprono Enterprises',
        location: 'Nakuru',
        rating: 4.7,
        totalSales: 210,
        joinedDate: '2022-01-25'
      },
      minOrder: 25,
      availableQuantity: 500,
      images: ['/images/wheat-flour.jpg'],
      specifications: {
        proteinContent: '12%',
        extractionRate: '75%',
        packaging: '25kg bags',
        type: 'All-Purpose'
      },
      rating: 4.6,
      reviewCount: 35,
      deliveryTime: '3-5 days',
      isAvailable: true,
      discount: 10,
      originalPrice: 89,
      tags: ['baking', 'premium', 'discount']
    },
    {
      _id: 'prod5',
      name: 'Organic Potatoes',
      category: 'Vegetables',
      description: 'Fresh organic potatoes grown without synthetic pesticides. Perfect for various culinary uses.',
      pricePerUnit: 40,
      unit: 'kg',
      farmer: {
        _id: 'f5',
        name: 'Green Valley Farms',
        location: 'Nyandarua',
        rating: 4.8,
        totalSales: 180,
        joinedDate: '2022-04-12'
      },
      minOrder: 50,
      availableQuantity: 1000,
      images: ['/images/potatoes.jpg'],
      specifications: {
        variety: 'Kenya Mpya',
        size: 'Medium to Large',
        packaging: '50kg bags',
        certification: 'Organic'
      },
      rating: 4.5,
      reviewCount: 22,
      deliveryTime: '2-3 days',
      isAvailable: true,
      isOrganic: true,
      tags: ['organic', 'fresh', 'healthy']
    },
    {
      _id: 'prod6',
      name: 'Fresh Carrots',
      category: 'Vegetables',
      description: 'Sweet and crunchy carrots rich in vitamins. Harvested fresh from our farms in Murang\'a.',
      pricePerUnit: 35,
      unit: 'kg',
      farmer: {
        _id: 'f6',
        name: 'Fresh Produce Co.',
        location: 'Murang\'a',
        rating: 4.6,
        totalSales: 95,
        joinedDate: '2022-08-30'
      },
      minOrder: 30,
      availableQuantity: 800,
      images: ['/images/carrots.jpg'],
      specifications: {
        color: 'Orange',
        sweetness: 'High',
        packaging: '30kg crates',
        freshness: 'Harvested Daily'
      },
      rating: 4.4,
      reviewCount: 18,
      deliveryTime: '1-2 days',
      isAvailable: true,
      tags: ['fresh', 'sweet', 'vitamin-rich']
    },
    {
      _id: 'prod7',
      name: 'Tomatoes Roma',
      category: 'Vegetables',
      description: 'Roma tomatoes perfect for cooking and salads. Firm texture with rich flavor.',
      pricePerUnit: 60,
      unit: 'kg',
      farmer: {
        _id: 'f7',
        name: 'Tomato Masters Ltd',
        location: 'Kajiado',
        rating: 4.3,
        totalSales: 120,
        joinedDate: '2022-05-18'
      },
      minOrder: 20,
      availableQuantity: 600,
      images: ['/images/tomatoes.jpg'],
      specifications: {
        variety: 'Roma',
        usage: 'Cooking & Salads',
        packaging: '20kg crates',
        shelfLife: '7 days'
      },
      rating: 4.2,
      reviewCount: 14,
      deliveryTime: '1-3 days',
      isAvailable: true,
      tags: ['cooking', 'salads', 'fresh']
    },
    {
      _id: 'prod8',
      name: 'Green Peas',
      category: 'Vegetables',
      description: 'Sweet green peas harvested at peak freshness. Perfect for freezing or immediate consumption.',
      pricePerUnit: 95,
      unit: 'kg',
      farmer: {
        _id: 'f8',
        name: 'Pea Paradise Farms',
        location: 'Nyeri',
        rating: 4.7,
        totalSales: 75,
        joinedDate: '2022-09-05'
      },
      minOrder: 15,
      availableQuantity: 300,
      images: ['/images/peas.jpg'],
      specifications: {
        sweetness: 'High',
        size: 'Small to Medium',
        packaging: '15kg bags',
        bestFor: 'Freezing & Cooking'
      },
      rating: 4.6,
      reviewCount: 11,
      deliveryTime: '2-4 days',
      isAvailable: true,
      tags: ['sweet', 'frozen', 'fresh']
    }
  ],
  orders: [
    {
      _id: 'order1',
      orderId: 'ORD001',
      items: [
        {
          product: {
            _id: 'prod1',
            name: 'Maize Grade 1',
            pricePerUnit: 50,
            unit: 'kg',
            image: '/images/maize.jpg'
          },
          quantity: 100,
          totalPrice: 5000
        }
      ],
      farmer: {
        _id: 'f1',
        name: 'John Kamau',
        phone: '254712345678',
        location: 'Nakuru'
      },
      totalAmount: 5000,
      status: 'delivered',
      orderDate: '2024-01-15T10:30:00Z',
      deliveryDate: '2024-01-20T14:00:00Z',
      deliveryAddress: {
        street: '123 Market Street',
        city: 'Nairobi',
        country: 'Kenya',
        contactName: 'John Doe',
        contactPhone: '254700000000'
      },
      paymentStatus: 'paid',
      paymentMethod: 'M-Pesa',
      trackingId: 'TRK001',
      deliveryNotes: 'Left at reception'
    },
    {
      _id: 'order2',
      orderId: 'ORD002',
      items: [
        {
          product: {
            _id: 'prod2',
            name: 'Beans Mwezi Moja',
            pricePerUnit: 120,
            unit: 'kg',
            image: '/images/beans.jpg'
          },
          quantity: 50,
          totalPrice: 6000
        }
      ],
      farmer: {
        _id: 'f2',
        name: 'Mary Wanjiku',
        phone: '254723456789',
        location: 'Kiambu'
      },
      totalAmount: 6000,
      status: 'in_transit',
      orderDate: '2024-01-18T09:15:00Z',
      estimatedDelivery: '2024-01-25T00:00:00Z',
      deliveryAddress: {
        street: '456 Business Avenue',
        city: 'Nairobi',
        country: 'Kenya',
        contactName: 'Jane Smith',
        contactPhone: '254711111111'
      },
      paymentStatus: 'paid',
      paymentMethod: 'Card',
      trackingId: 'TRK002',
      currentLocation: 'Naivasha Depot'
    },
    {
      _id: 'order3',
      orderId: 'ORD003',
      items: [
        {
          product: {
            _id: 'prod3',
            name: 'Rice Pishori',
            pricePerUnit: 180,
            unit: 'kg',
            image: '/images/rice.jpg'
          },
          quantity: 75,
          totalPrice: 13500
        },
        {
          product: {
            _id: 'prod4',
            name: 'Wheat Flour Premium',
            pricePerUnit: 80,
            unit: 'kg',
            image: '/images/wheat-flour.jpg'
          },
          quantity: 50,
          totalPrice: 4000
        }
      ],
      farmer: {
        _id: 'f3',
        name: 'Mwea Rice Farmers Coop',
        phone: '254734567890',
        location: 'Kirinyaga'
      },
      totalAmount: 17500,
      status: 'processing',
      orderDate: '2024-01-19T14:20:00Z',
      estimatedDelivery: '2024-01-26T00:00:00Z',
      deliveryAddress: {
        street: '789 Industrial Area',
        city: 'Nairobi',
        country: 'Kenya',
        contactName: 'Mike Johnson',
        contactPhone: '254722222222'
      },
      paymentStatus: 'paid',
      paymentMethod: 'Bank Transfer'
    },
    {
      _id: 'order4',
      orderId: 'ORD004',
      items: [
        {
          product: {
            _id: 'prod5',
            name: 'Organic Potatoes',
            pricePerUnit: 40,
            unit: 'kg',
            image: '/images/potatoes.jpg'
          },
          quantity: 100,
          totalPrice: 4000
        }
      ],
      farmer: {
        _id: 'f5',
        name: 'Green Valley Farms',
        phone: '254745678901',
        location: 'Nyandarua'
      },
      totalAmount: 4000,
      status: 'pending',
      orderDate: '2024-01-20T11:00:00Z',
      estimatedDelivery: '2024-01-23T00:00:00Z',
      deliveryAddress: {
        street: '321 Farm Road',
        city: 'Thika',
        country: 'Kenya',
        contactName: 'Sarah Kimani',
        contactPhone: '254733333333'
      },
      paymentStatus: 'pending'
    }
  ],
  wishlist: [
    {
      _id: 'wish1',
      product: {
        _id: 'prod3',
        name: 'Rice Pishori',
        category: 'Grains',
        pricePerUnit: 180,
        unit: 'kg',
        farmer: {
          name: 'Mwea Rice Farmers Coop',
          location: 'Kirinyaga',
          rating: 4.8
        },
        minOrder: 20,
        availableQuantity: 800,
        image: '/images/rice.jpg',
        rating: 4.7,
        reviewCount: 42
      },
      addedDate: '2024-01-10T14:20:00Z',
      note: 'For restaurant supply'
    },
    {
      _id: 'wish2',
      product: {
        _id: 'prod6',
        name: 'Fresh Carrots',
        category: 'Vegetables',
        pricePerUnit: 35,
        unit: 'kg',
        farmer: {
          name: 'Fresh Produce Co.',
          location: 'Murang\'a',
          rating: 4.6
        },
        minOrder: 30,
        availableQuantity: 800,
        image: '/images/carrots.jpg',
        rating: 4.4,
        reviewCount: 18
      },
      addedDate: '2024-01-12T09:45:00Z',
      note: 'For juice production'
    },
    {
      _id: 'wish3',
      product: {
        _id: 'prod8',
        name: 'Green Peas',
        category: 'Vegetables',
        pricePerUnit: 95,
        unit: 'kg',
        farmer: {
          name: 'Pea Paradise Farms',
          location: 'Nyeri',
          rating: 4.7
        },
        minOrder: 15,
        availableQuantity: 300,
        image: '/images/peas.jpg',
        rating: 4.6,
        reviewCount: 11
      },
      addedDate: '2024-01-15T16:30:00Z',
      note: 'For frozen food business'
    }
  ],
  notifications: [
    {
      _id: 'notif1',
      title: 'Order Delivered',
      message: 'Your order ORD001 has been delivered successfully',
      type: 'order_update',
      read: false,
      createdAt: '2024-01-20T14:05:00Z',
      actionUrl: '/orders/ORD001'
    },
    {
      _id: 'notif2',
      title: 'Price Drop Alert',
      message: 'Maize Grade 1 price has dropped to KES 45 per kg',
      type: 'price_alert',
      read: false,
      createdAt: '2024-01-19T11:30:00Z',
      actionUrl: '/products/prod1'
    },
    {
      _id: 'notif3',
      title: 'New Product Available',
      message: 'Fresh organic potatoes now available from Green Valley Farms',
      type: 'product_alert',
      read: true,
      createdAt: '2024-01-18T16:45:00Z',
      actionUrl: '/products/prod5'
    },
    {
      _id: 'notif4',
      title: 'Payment Received',
      message: 'Payment of KES 5,000 for order ORD001 has been confirmed',
      type: 'payment',
      read: true,
      createdAt: '2024-01-15T12:20:00Z',
      actionUrl: '/orders/ORD001'
    },
    {
      _id: 'notif5',
      title: 'Delivery Update',
      message: 'Your order ORD002 is now in transit and will arrive by Jan 25',
      type: 'delivery_update',
      read: false,
      createdAt: '2024-01-19T15:10:00Z',
      actionUrl: '/orders/ORD002'
    }
  ]
};

// Dashboard - FORCE MOCK DATA
router.get('/dashboard', async (req, res) => {
  try {
    if (USE_MOCK_DATA) {
      console.log('🔄 FORCING MOCK buyer dashboard data');
      return res.json({
        success: true,
        data: mockBuyerData.dashboard,
        source: 'mock_forced'
      });
    }
    
    console.log('📊 Using REAL buyer dashboard data');
    return await buyerController.getDashboard(req, res);
    
  } catch (error) {
    console.error('Buyer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch buyer dashboard'
    });
  }
});

// Products - FORCE MOCK DATA
router.get('/products', async (req, res) => {
  try {
    if (USE_MOCK_DATA) {
      console.log('🔄 FORCING MOCK products data');
      const { category, search, page = 1, limit = 10 } = req.query;
      
      let products = mockBuyerData.products;
      
      // Filtering
      if (category) {
        products = products.filter(p => p.category === category);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.farmer.name.toLowerCase().includes(searchLower)
        );
      }
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedProducts = products.slice(startIndex, endIndex);
      
      return res.json({
        success: true,
        data: {
          products: paginatedProducts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: products.length,
            pages: Math.ceil(products.length / limit)
          },
          filters: {
            categories: ['Grains', 'Pulses', 'Vegetables', 'Fruits'],
            priceRanges: ['0-50', '51-100', '101-200', '201+']
          }
        },
        source: 'mock_forced'
      });
    }
    
    console.log('🛍️ Using REAL products data');
    return await buyerController.browseProducts(req, res);
    
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Product Details - FORCE MOCK DATA
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (USE_MOCK_DATA) {
      console.log('🔄 FORCING MOCK product details:', id);
      
      const product = mockBuyerData.products.find(p => p._id === id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // Add related products
      const relatedProducts = mockBuyerData.products
        .filter(p => p.category === product.category && p._id !== id)
        .slice(0, 4);
      
      return res.json({
        success: true,
        data: {
          product: product,
          relatedProducts: relatedProducts,
          farmerStats: {
            responseRate: 95,
            deliveryOnTime: 98,
            customerSatisfaction: 4.5
          }
        },
        source: 'mock_forced'
      });
    }
    
    console.log('🔍 Using REAL product details');
    return await buyerController.getProductDetails(req, res);
    
  } catch (error) {
    console.error('Product details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product details'
    });
  }
});

// Orders - FORCE MOCK DATA
router.get('/orders', async (req, res) => {
  try {
    if (USE_MOCK_DATA) {
      console.log('🔄 FORCING MOCK orders data');
      const { status, page = 1, limit = 10 } = req.query;
      
      let orders = mockBuyerData.orders;
      
      if (status) {
        orders = orders.filter(order => order.status === status);
      }
      
      // Order summary
      const orderSummary = {
        total: orders.length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        in_transit: orders.filter(o => o.status === 'in_transit').length,
        processing: orders.filter(o => o.status === 'processing').length,
        pending: orders.filter(o => o.status === 'pending').length
      };
      
      return res.json({
        success: true,
        data: {
          orders: orders,
          summary: orderSummary,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: orders.length,
            pages: Math.ceil(orders.length / limit)
          }
        },
        source: 'mock_forced'
      });
    }
    
    console.log('📦 Using REAL orders data');
    return await buyerController.getOrders(req, res);
    
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Place Order - FORCE MOCK DATA
router.post('/orders', async (req, res) => {
  try {
    if (USE_MOCK_DATA) {
      console.log('🔄 FORCING MOCK order placement');
      
      const orderId = 'ORD' + Date.now();
      const order = {
        _id: 'mock_' + Date.now(),
        orderId: orderId,
        status: 'confirmed',
        totalAmount: req.body.totalAmount || 0,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        items: req.body.items || [],
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      };
      
      return res.json({
        success: true,
        data: {
          order: order,
          message: 'Order placed successfully'
        },
        source: 'mock_forced'
      });
    }
    
    console.log('🛒 Using REAL order placement');
    return await buyerController.placeOrder(req, res);
    
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order'
    });
  }
});

// Wishlist - FORCE MOCK DATA
router.get('/wishlist', async (req, res) => {
  try {
    if (USE_MOCK_DATA) {
      console.log('🔄 FORCING MOCK wishlist data');
      
      return res.json({
        success: true,
        data: {
          items: mockBuyerData.wishlist,
          totalItems: mockBuyerData.wishlist.length,
          totalValue: mockBuyerData.wishlist.reduce((sum, item) => 
            sum + (item.product.pricePerUnit * item.product.minOrder), 0
          )
        },
        source: 'mock_forced'
      });
    }
    
    console.log('❤️ Using REAL wishlist data');
    return await buyerController.getWishlist(req, res);
    
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist'
    });
  }
});

// Add to Wishlist - FORCE MOCK DATA
router.post('/wishlist', async (req, res) => {
  try {
    if (USE_MOCK_DATA) {
      console.log('🔄 FORCING MOCK wishlist addition');
      
      return res.json({
        success: true,
        data: {
          message: 'Product added to wishlist successfully'
        },
        source: 'mock_forced'
      });
    }
    
    console.log('➕ Using REAL wishlist addition');
    return await buyerController.addToWishlist(req, res);
    
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist'
    });
  }
});

// Remove from Wishlist - FORCE MOCK DATA
router.delete('/wishlist/:productId', async (req, res) => {
  try {
    if (USE_MOCK_DATA) {
      console.log('🔄 FORCING MOCK wishlist removal');
      
      return res.json({
        success: true,
        data: {
          message: 'Product removed from wishlist successfully'
        },
        source: 'mock_forced'
      });
    }
    
    console.log('➖ Using REAL wishlist removal');
    return await buyerController.removeFromWishlist(req, res);
    
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist'
    });
  }
});

// Notifications - FORCE MOCK DATA
router.get('/notifications', async (req, res) => {
  try {
    if (USE_MOCK_DATA) {
      console.log('🔄 FORCING MOCK notifications data');
      
      const notifications = mockBuyerData.notifications;
      const unreadCount = notifications.filter(n => !n.read).length;
      
      return res.json({
        success: true,
        data: {
          notifications: notifications,
          unreadCount: unreadCount,
          total: notifications.length
        },
        source: 'mock_forced'
      });
    }
    
    console.log('🔔 Using REAL notifications data');
    return await buyerController.getNotifications(req, res);
    
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

module.exports = router;