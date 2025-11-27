// src/pages/BuyerDashboard.jsx - OPTIMIZED WITH UNIFIED PAYMENT SYSTEM
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import PaystackPayment from '../components/payments/PaystackPayment';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import ProductDiscovery from '../components/dashboard/ProductDiscovery';
import OrderManagement from '../components/dashboard/OrderManagement';
import PaymentsFinance from '../components/dashboard/PaymentsFinance';
import SupplierRelations from '../components/dashboard/SupplierRelations';
import MarketIntelligence from '../components/dashboard/MarketIntelligence';
import ShoppingCart from '../components/dashboard/ShoppingCart';
import NotificationsPanel from '../components/dashboard/NotificationsPanel';

const BuyerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { totalItems, clearCart, cartItems } = useCart();
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [showActionMessage, setShowActionMessage] = useState(false);
  
  // Payment state - USING UNIFIED SYSTEM
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);

  // UI states
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);

  // Enhanced mock data
  const generateEnhancedMockData = () => {
    return {
      overview: {
        activeOrders: 3,
        totalSpent: 45250,
        favoriteSuppliersCount: 4,
        cartItems: totalItems,
        monthlySavings: 12500,
        completedOrders: 12
      },
      recentOrders: [
        {
          _id: 'ord_001',
          productName: 'Premium Organic Maize',
          orderId: 'ORD-001',
          amount: 22500,
          status: 'delivered',
          orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          deliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          trackingNumber: 'TRK-789012',
          supplier: 'Green Valley Farms',
          quantity: 500,
          unit: 'kg',
          buyer: {
            name: user?.name || 'Buyer',
            email: user?.email || 'buyer@example.com',
            phone: user?.phone || '+254700000000'
          }
        },
        {
          _id: 'ord_002', 
          productName: 'Fresh Tomatoes',
          orderId: 'ORD-002',
          amount: 9600,
          status: 'processing',
          orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          trackingNumber: 'TRK-789013',
          supplier: 'Sunrise Farms',
          quantity: 80,
          unit: 'kg',
          buyer: {
            name: user?.name || 'Buyer',
            email: user?.email || 'buyer@example.com',
            phone: user?.phone || '+254700000000'
          }
        },
        {
          _id: 'ord_003',
          productName: 'Organic Beans',
          orderId: 'ORD-003',
          amount: 13150,
          status: 'pending_payment',
          orderDate: new Date().toISOString(),
          supplier: 'Mountain View Organics',
          quantity: 150,
          unit: 'kg',
          buyer: {
            name: user?.name || 'Buyer',
            email: user?.email || 'buyer@example.com',
            phone: user?.phone || '+254700000000'
          }
        }
      ],
      favoriteSuppliers: [
        {
          _id: 'sup_001',
          name: 'Green Valley Farms',
          location: 'Nakuru, Kenya',
          rating: 4.8,
          products: ['Maize', 'Beans', 'Wheat', 'Barley'],
          orderCount: 12,
          responseTime: '2 hours',
          contact: '+254712345678',
          certification: 'Organic Certified',
          deliveryAreas: ['Nairobi', 'Nakuru', 'Eldoret']
        },
        {
          _id: 'sup_002',
          name: 'Sunrise Farms',
          location: 'Kiambu, Kenya',
          rating: 4.6,
          products: ['Tomatoes', 'Cabbage', 'Spinach', 'Kale'],
          orderCount: 8,
          responseTime: '3 hours',
          contact: '+254723456789',
          certification: 'Fresh Produce',
          deliveryAreas: ['Nairobi', 'Thika', 'Machakos']
        },
        {
          _id: 'sup_003',
          name: 'Mountain View Organics',
          location: 'Meru, Kenya',
          rating: 4.9,
          products: ['Beans', 'Peas', 'Lentils', 'Chickpeas'],
          orderCount: 5,
          responseTime: '4 hours',
          contact: '+254734567890',
          certification: 'Organic & Fair Trade',
          deliveryAreas: ['Nairobi', 'Meru', 'Embu', 'Nanyuki']
        }
      ],
      recommendedProducts: [
        {
          _id: 'prod_001',
          name: 'Fresh Organic Maize',
          description: 'High quality organic maize from our farm in the Rift Valley. Grown without synthetic pesticides or fertilizers.',
          category: 'grains',
          price: 45,
          unit: 'kg',
          quantity: 1500,
          minOrder: 50,
          farmer: {
            profile: {
              firstName: 'John',
              lastName: 'Kamau', 
              businessName: 'Green Valley Farms'
            },
            farmerProfile: {
              farmName: 'Green Valley Organic Farm',
              location: 'Nakuru'
            }
          },
          qualityGrade: 'premium',
          isOrganic: true,
          status: 'available',
          harvestDate: '2024-01-15',
          deliveryTime: '2-3 days',
          rating: 4.8,
          reviews: 24
        },
        {
          _id: 'prod_002',
          name: 'Fresh Tomatoes',
          description: 'Fresh red tomatoes from local farms. Perfect for cooking, salads, and processing.',
          category: 'vegetables',
          price: 120,
          unit: 'kg',
          quantity: 800,
          minOrder: 20,
          farmer: {
            profile: {
              firstName: 'Mary',
              lastName: 'Wanjiku',
              businessName: 'Sunrise Farms'
            },
            farmerProfile: {
              farmName: 'Sunrise Vegetable Farm',
              location: 'Kiambu'
            }
          },
          qualityGrade: 'standard',
          isOrganic: false,
          status: 'available',
          harvestDate: '2024-01-18',
          deliveryTime: '1-2 days',
          rating: 4.5,
          reviews: 18
        },
        {
          _id: 'prod_003',
          name: 'Organic Beans',
          description: 'Premium organic beans rich in protein and fiber. Perfect for family consumption and commercial use.',
          category: 'legumes',
          price: 85,
          unit: 'kg',
          quantity: 1200,
          minOrder: 25,
          farmer: {
            profile: {
              firstName: 'Peter',
              lastName: 'Gitonga',
              businessName: 'Mountain View Organics'
            },
            farmerProfile: {
              farmName: 'Mountain View Organic Farm',
              location: 'Meru'
            }
          },
          qualityGrade: 'premium',
          isOrganic: true,
          status: 'available',
          harvestDate: '2024-01-12',
          deliveryTime: '3-4 days',
          rating: 4.9,
          reviews: 32
        },
        {
          _id: 'prod_004',
          name: 'Fresh Avocados',
          description: 'Hass avocados, creamy and delicious. Perfect for export quality and local markets.',
          category: 'fruits',
          price: 60,
          unit: 'piece',
          quantity: 500,
          minOrder: 100,
          farmer: {
            profile: {
              firstName: 'Sarah',
              lastName: 'Nyong\'o',
              businessName: 'Tropical Fruits Ltd'
            },
            farmerProfile: {
              farmName: 'Tropical Fruits Farm',
              location: 'Murang\'a'
            }
          },
          qualityGrade: 'export',
          isOrganic: true,
          status: 'available',
          harvestDate: '2024-01-20',
          deliveryTime: '2-3 days',
          rating: 4.7,
          reviews: 15
        }
      ],
      quickStats: {
        completedOrders: 12,
        pendingReviews: 3,
        wishlistItems: 5,
        monthlyBudget: 100000,
        savingsThisMonth: 12500
      },
      marketInsights: {
        priceTrends: {
          maize: -8,
          tomatoes: +5,
          beans: -3,
          avocados: +12
        },
        demandLevels: {
          maize: 'high',
          tomatoes: 'medium',
          beans: 'high',
          avocados: 'very high'
        }
      }
    };
  };

  const enhancedMockNotifications = [
    {
      id: 1,
      type: 'order_update',
      title: 'Order Shipped',
      message: 'Your order ORD-002 has been shipped and is on the way. Tracking: TRK-789013',
      time: '2 hours ago',
      read: false,
      orderId: 'ORD-002',
      priority: 'high'
    },
    {
      id: 2,
      type: 'price_alert', 
      title: 'Price Drop Alert',
      message: 'Maize prices decreased by 8% in your region. Great time to buy!',
      time: '5 hours ago',
      read: false,
      productId: 'prod_001',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'supplier_news',
      title: 'New Products Available',
      message: 'Green Valley Farms added new organic products to their catalog',
      time: '1 day ago',
      read: true,
      supplierId: 'sup_001',
      priority: 'low'
    },
    {
      id: 4,
      type: 'delivery_reminder',
      title: 'Delivery Expected Tomorrow',
      message: 'Your order ORD-001 is scheduled for delivery tomorrow between 9 AM - 12 PM',
      time: '3 hours ago',
      read: false,
      orderId: 'ORD-001',
      priority: 'high'
    }
  ];

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Try to fetch from backend first
      const token = localStorage.getItem('agripay_token');
      let backendData = {};
      
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agripay-platform.onrender.com/api';
        const response = await fetch(`${API_BASE_URL}/buyer/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          backendData = await response.json();
          console.log('✅ Buyer dashboard data loaded:', backendData);
        }
      } catch (error) {
        console.log('⚠️ Using enhanced mock data:', error.message);
      }

      // Enhanced dashboard data
      const enhancedData = generateEnhancedMockData();
      
      // Merge with backend data if available
      if (backendData && Object.keys(backendData).length > 0) {
        setDashboardData({ ...enhancedData, ...backendData });
        setUsingMockData(false);
      } else {
        setDashboardData(enhancedData);
        setUsingMockData(true);
      }

      setNotifications(enhancedMockNotifications);
      showMessage('🛒 Buyer dashboard loaded successfully!');
      
    } catch (error) {
      console.error('Error loading buyer dashboard:', error);
      showMessage('❌ Failed to load buyer data');
      // Fallback to mock data
      setDashboardData(generateEnhancedMockData());
      setNotifications(enhancedMockNotifications);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Show action message
  const showMessage = (message) => {
    setActionMessage(message);
    setShowActionMessage(true);
    setTimeout(() => setShowActionMessage(false), 5000);
  };

  // ✅ OPTIMIZED: Payment functions using unified system
  const handleBuyNow = (product) => {
    console.log('🛒 Buying product:', product.name);
    
    const totalAmount = product.price * product.minOrder;
    
    setPaymentConfig({
      amount: totalAmount,
      productName: `${product.name} - ${product.minOrder} ${product.unit}`,
      email: user?.email || 'buyer@example.com',
      description: `Purchase of ${product.minOrder} ${product.unit} ${product.name} from ${product.farmer?.profile?.businessName || 'Supplier'}`,
      userType: 'buyer'
    });
    setShowPaymentModal(true);
    
    showMessage(`🛒 Preparing to purchase ${product.name}...`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showMessage('❌ Your cart is empty!');
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const productNames = cartItems.map(item => item.name).join(', ');
    
    console.log('💰 Checking out cart:', { items: cartItems.length, totalAmount });
    
    setPaymentConfig({
      amount: totalAmount,
      productName: `Cart Checkout - ${cartItems.length} items`,
      email: user?.email || 'buyer@example.com',
      description: `Purchase of ${cartItems.length} items: ${productNames}`,
      userType: 'buyer'
    });
    setShowPaymentModal(true);
    
    showMessage(`💰 Processing cart checkout for ${cartItems.length} items...`);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('✅ Payment successful:', paymentData);
    setShowPaymentModal(false);
    
    showMessage(`✅ Payment Successful! KES ${paymentData.amount} paid for ${paymentData.productName}`);
    
    // Clear cart if it was a cart checkout
    if (paymentData.productName.includes('Cart Checkout')) {
      clearCart();
      showMessage('🛒 Cart cleared after successful payment!');
    }
    
    // Refresh dashboard data
    loadDashboardData();
  };

  // ✅ OPTIMIZED: Navigation and UI functions
  const handleSectionChange = (section) => {
    console.log('📱 Changing section to:', section);
    setActiveSection(section);
    setShowNotifications(false);
    setShowCart(false);
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSection('discovery');
      showMessage(`🔍 Searching for: ${searchQuery}`);
      console.log('🔍 Searching for:', searchQuery);
    }
  };

  // ✅ OPTIMIZED: Notification functions
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    showMessage('✅ All notifications marked as read');
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    showMessage('✅ Notification marked as read');
  };

  // ✅ OPTIMIZED: Refresh data function
  const refreshData = async () => {
    setLoading(true);
    try {
      await loadDashboardData();
      showMessage('🔄 Data refreshed successfully!');
    } catch (error) {
      console.error('Failed to refresh data:', error);
      showMessage('❌ Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ OPTIMIZED: Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('👋 Buyer logging out');
      await logout();
      navigate('/');
    }
  };

  // Calculate unread notifications
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Safe quick stats with fallbacks
  const quickStats = {
    activeOrders: dashboardData?.overview?.activeOrders || 0,
    cartItems: totalItems,
    savedSuppliers: dashboardData?.overview?.favoriteSuppliersCount || 0,
    totalSpent: dashboardData?.overview?.totalSpent || 0,
    monthlySavings: dashboardData?.overview?.monthlySavings || 0,
    completedOrders: dashboardData?.quickStats?.completedOrders || 0
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Your Buyer Dashboard...</p>
          <p className="text-sm text-gray-500">Preparing your shopping experience</p>
        </div>
      </div>
    );
  }

  // Section configuration
  const sections = {
    overview: { name: 'Dashboard Overview', icon: '📊' },
    discovery: { name: 'Product Discovery', icon: '🔍' },
    orders: { name: 'Order Management', icon: '📦' },
    payments: { name: 'Payments & Finance', icon: '💳' },
    suppliers: { name: 'Supplier Relations', icon: '🤝' },
    intelligence: { name: 'Market Intelligence', icon: '📈' }
  };

  // Render section with proper props
  const renderSection = () => {
    const commonProps = {
      searchQuery: activeSection === 'discovery' ? searchQuery : '',
      dashboardData: dashboardData,
      onDataUpdate: refreshData,
      usingMockData: usingMockData,
      onBuyNow: handleBuyNow,
      onCheckout: handleCheckout
    };

    switch (activeSection) {
      case 'overview':
        return <DashboardOverview {...commonProps} onNavigate={setActiveSection} />;
      case 'discovery':
        return <ProductDiscovery {...commonProps} />;
      case 'orders':
        return <OrderManagement {...commonProps} />;
      case 'payments':
        return <PaymentsFinance {...commonProps} />;
      case 'suppliers':
        return <SupplierRelations {...commonProps} />;
      case 'intelligence':
        return <MarketIntelligence {...commonProps} />;
      default:
        return <DashboardOverview {...commonProps} onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                AgriPay <span className="text-green-600">Buyer</span>
                {usingMockData && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Demo Mode
                  </span>
                )}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products, suppliers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowCart(false);
                    setShowUserMenu(false);
                  }}
                  className="p-2 text-gray-600 hover:text-gray-900 relative transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </div>

              {/* Cart */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowCart(!showCart);
                    setShowNotifications(false);
                    setShowUserMenu(false);
                  }}
                  className="p-2 text-gray-600 hover:text-gray-900 relative transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                    setShowCart(false);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'B'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name || user?.email || 'Buyer'}</p>
                    <p className="text-xs text-gray-600">AgriPay Member</p>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveSection('payments');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>My Profile</span>
                    </button>

                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveSection('payments');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Action Message */}
      {showActionMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {actionMessage}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {(showUserMenu || showNotifications || showCart) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
            setShowCart(false);
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
            <ul className="space-y-2">
              {Object.entries(sections).map(([key, { name, icon }]) => (
                <li key={key}>
                  <button
                    onClick={() => handleSectionChange(key)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === key
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <span className="text-lg">{icon}</span>
                      <span className="font-medium">{name}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Orders:</span>
                  <span className="font-semibold text-gray-800">{quickStats.activeOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cart Items:</span>
                  <span className="font-semibold text-gray-800">{quickStats.cartItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saved Suppliers:</span>
                  <span className="font-semibold text-gray-800">{quickStats.savedSuppliers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-semibold text-gray-800">KES {quickStats.totalSpent?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Savings:</span>
                  <span className="font-semibold text-green-600">KES {quickStats.monthlySavings?.toLocaleString()}</span>
                </div>
              </div>
              {usingMockData && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                  💡 <strong>Live Demo:</strong> Enhanced with sample data
                </div>
              )}
              
              {/* Refresh Button */}
              <button
                onClick={refreshData}
                disabled={loading}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {renderSection()}
          </main>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      )}

      {/* Shopping Cart */}
      {showCart && (
        <ShoppingCart
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}

      {/* ✅ OPTIMIZED: Unified Paystack Payment Modal */}
      {showPaymentModal && paymentConfig && (
        <PaystackPayment
          amount={paymentConfig.amount}
          email={paymentConfig.email}
          productName={paymentConfig.productName}
          description={paymentConfig.description}
          userType={paymentConfig.userType}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default BuyerDashboard;