// src/pages/BuyerDashboard.jsx - COMPLETELY FIXED WITH WORKING BUTTONS
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import ProductDiscovery from '../components/dashboard/ProductDiscovery';
import OrderManagement from '../components/dashboard/OrderManagement';
import PaymentsFinance from '../components/dashboard/PaymentsFinance';
import SupplierRelations from '../components/dashboard/SupplierRelations';
import MarketIntelligence from '../components/dashboard/MarketIntelligence';
import ShoppingCart from '../components/dashboard/ShoppingCart';
import NotificationsPanel from '../components/dashboard/NotificationsPanel';
import { buyerService } from '../services/buyerService';

// REAL Paystack Payment Component for Buyer - FIXED
const PaystackPayment = ({ 
  order, 
  amount, 
  productName, 
  onSuccess, 
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script dynamically
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Paystack script loaded successfully');
      setPaystackLoaded(true);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Paystack script');
      setError('Failed to load payment system. Please refresh the page.');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // REAL Paystack Integration for Buyer
  const initializePayment = () => {
    if (!paystackLoaded) {
      setError('Payment system still loading. Please wait...');
      return;
    }

    if (!window.PaystackPop) {
      setError('Payment system not available. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    // Your LIVE Paystack Public Key
    const paystackPublicKey = 'pk_live_cf0f48867990a202a1d8a8ce3ab76a7fdf0998a8';

    // Generate unique reference
    const reference = 'BUYER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    console.log('💰 Buyer Payment Initializing:', {
      product: productName,
      amount,
      reference
    });

    try {
      // Create payment handler
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: order?.buyer?.email || 'buyer@example.com',
        amount: amount * 100, // Convert to kobo
        currency: 'KES',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Buyer Name",
              variable_name: "buyer_name",
              value: order?.buyer?.name || 'AgriPay Buyer'
            },
            {
              display_name: "Product",
              variable_name: "product_name", 
              value: productName
            },
            {
              display_name: "Order Type",
              variable_name: "order_type",
              value: order?.type || 'product_purchase'
            }
          ]
        },
        callback: function(response) {
          // Payment successful
          console.log('✅ Buyer Payment successful:', response);
          
          setLoading(false);
          onSuccess({
            amount: amount,
            order: order,
            reference: response.reference,
            transactionId: response.transaction,
            status: 'success',
            productName: productName
          });
        },
        onClose: function() {
          // Payment window closed
          console.log('Buyer payment window closed');
          setLoading(false);
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('❌ Buyer Payment initialization error:', error);
      setError('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full mx-auto shadow-2xl">
        <div className="bg-green-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🛒</span>
              <div>
                <h3 className="text-xl font-bold">Complete Purchase</h3>
                <p className="text-green-100">Secure payment via Paystack</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-lg font-semibold"
              disabled={loading}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Product:</span>
              <span className="font-semibold text-gray-800">{productName}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Order Type:</span>
              <span className="font-semibold text-gray-800">
                {order?.type === 'cart_checkout' ? 'Cart Checkout' : 'Single Product'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">
                KES {amount?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {!paystackLoaded && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <p className="text-blue-700 text-sm">Loading payment system...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Payment Action */}
          <div className="space-y-3">
            <button
              onClick={initializePayment}
              disabled={loading || !paystackLoaded}
              className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold text-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span className="mr-2">💳</span>
                  Pay via Paystack
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
            >
              Cancel Payment
            </button>
          </div>

          {/* Payment Methods Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              <strong>Accepted Methods:</strong> Card, Bank Transfer, Mobile Money
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BuyerDashboard = () => {
  const { user, logout } = useAuth();
  const { totalItems, clearCart, cartItems } = useCart();
  const [activeSection, setActiveSection] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);
  
  // NEW: Paystack payment state
  const [showPaystack, setShowPaystack] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentProduct, setPaymentProduct] = useState('');

  // FIXED: Enhanced mock data with working buttons
  const generateMockData = (realData) => {
    const baseData = realData || {};
    
    const mockDashboardData = {
      overview: {
        activeOrders: baseData.overview?.activeOrders || 2,
        totalSpent: baseData.overview?.totalSpent || 34250,
        favoriteSuppliersCount: baseData.overview?.favoriteSuppliersCount || 3,
        cartItems: totalItems
      },
      recentOrders: baseData.recentOrders?.length > 0 ? baseData.recentOrders : [
        {
          _id: 'ord_001',
          productName: 'Premium Maize',
          orderId: 'ORD-001',
          amount: 22500,
          status: 'delivered',
          orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          trackingNumber: 'TRK-789012',
          buyer: {
            name: user?.name || 'Buyer',
            email: user?.email || 'buyer@example.com'
          }
        },
        {
          _id: 'ord_002', 
          productName: 'Fresh Tomatoes',
          orderId: 'ORD-002',
          amount: 9600,
          status: 'pending_payment',
          orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          trackingNumber: 'TRK-789013',
          buyer: {
            name: user?.name || 'Buyer',
            email: user?.email || 'buyer@example.com'
          }
        }
      ],
      favoriteSuppliers: baseData.favoriteSuppliers?.length > 0 ? baseData.favoriteSuppliers : [
        {
          _id: 'sup_001',
          name: 'Green Valley Farms',
          location: 'Nakuru, Kenya',
          rating: 4.8,
          products: ['Maize', 'Beans', 'Wheat'],
          orderCount: 12,
          responseTime: '2 hours',
          contact: '+254712345678'
        }
      ],
      recommendedProducts: baseData.recommendedProducts?.length > 0 ? baseData.recommendedProducts : [
        {
          _id: 'prod_001',
          name: 'Fresh Organic Maize',
          description: 'High quality organic maize from our farm in the Rift Valley',
          category: 'grains',
          price: 45,
          unit: 'kg',
          quantity: 150,
          minOrder: 1,
          farmer: {
            profile: {
              firstName: 'John',
              lastName: 'Kamau', 
              businessName: 'Green Valley Farms'
            },
            farmerProfile: {
              farmName: 'Green Valley Organic Farm'
            }
          },
          qualityGrade: 'premium',
          isOrganic: true,
          status: 'available'
        },
        {
          _id: 'prod_002',
          name: 'Fresh Tomatoes',
          description: 'Fresh red tomatoes from local farms',
          category: 'vegetables',
          price: 120,
          unit: 'kg',
          quantity: 80,
          minOrder: 2,
          farmer: {
            profile: {
              firstName: 'Mary',
              lastName: 'Wanjiku',
              businessName: 'Sunrise Farms'
            }
          },
          qualityGrade: 'standard',
          isOrganic: false,
          status: 'available'
        }
      ],
      quickStats: baseData.quickStats || {
        completedOrders: 5,
        pendingReviews: 1,
        wishlistItems: 2
      }
    };

    const mockNotifications = [
      {
        id: 1,
        type: 'order_update',
        title: 'Order Shipped',
        message: 'Your order ORD-002 has been shipped and is on the way',
        time: '2 hours ago',
        read: false,
        orderId: 'ORD-002'
      },
      {
        id: 2,
        type: 'price_alert', 
        title: 'Price Drop Alert',
        message: 'Maize prices decreased by 8% in your region',
        time: '5 hours ago',
        read: false,
        productId: 'prod_001'
      },
      {
        id: 3,
        type: 'supplier_news',
        title: 'New Products Available',
        message: 'Green Valley Farms added new organic products',
        time: '1 day ago',
        read: true,
        supplierId: 'sup_001'
      }
    ];

    return { mockDashboardData, mockNotifications };
  };

  // FIXED: Load real data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      try {
        const [dashboardResult, notificationsResult] = await Promise.all([
          buyerService.getDashboardData(),
          buyerService.getNotifications()
        ]);

        const hasSubstantialData = dashboardResult && 
          (dashboardResult.recommendedProducts?.length > 0 || dashboardResult.overview?.totalSpent > 0);
        
        const hasRealNotifications = notificationsResult && 
          (notificationsResult.notifications?.length > 0 || notificationsResult.length > 0);

        if (hasSubstantialData) {
          console.log('✅ Using real backend data');
          setDashboardData(dashboardResult);
          setUsingMockData(false);
        } else {
          console.log('🔄 Enhancing with mock data');
          const { mockDashboardData } = generateMockData(dashboardResult);
          setDashboardData(mockDashboardData);
          setUsingMockData(true);
        }

        if (hasRealNotifications) {
          const realNotifications = notificationsResult.notifications || notificationsResult;
          setNotifications(realNotifications);
        } else {
          console.log('🔄 Adding mock notifications');
          const { mockNotifications } = generateMockData();
          setNotifications(mockNotifications);
        }

      } catch (error) {
        console.error('❌ Failed to load data, using enhanced mock:', error);
        const { mockDashboardData, mockNotifications } = generateMockData();
        setDashboardData(mockDashboardData);
        setNotifications(mockNotifications);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const sections = {
    overview: { name: 'Dashboard Overview', icon: '📊' },
    discovery: { name: 'Product Discovery', icon: '🔍' },
    orders: { name: 'Order Management', icon: '📦' },
    payments: { name: 'Payments & Finance', icon: '💳' },
    suppliers: { name: 'Supplier Relations', icon: '🤝' },
    intelligence: { name: 'Market Intelligence', icon: '📈' }
  };

  // FIXED: Calculate unread notifications
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // FIXED: Search function
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSection('discovery');
      console.log('🔍 Searching for:', searchQuery);
    }
  };

  // FIXED: Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    console.log('✅ All notifications marked as read');
  };

  // FIXED: Mark single notification as read
  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    console.log('✅ Notification marked as read:', notificationId);
  };

  // FIXED: Refresh data function
  const refreshData = async () => {
    setLoading(true);
    try {
      const [dashboardResult, notificationsResult] = await Promise.all([
        buyerService.getDashboardData(),
        buyerService.getNotifications()
      ]);

      const hasSubstantialData = dashboardResult && 
        (dashboardResult.recommendedProducts?.length > 0 || dashboardResult.overview?.totalSpent > 0);

      if (hasSubstantialData) {
        setDashboardData(dashboardResult);
        setUsingMockData(false);
      } else {
        const { mockDashboardData } = generateMockData(dashboardResult);
        setDashboardData(mockDashboardData);
        setUsingMockData(true);
      }

      const hasRealNotifications = notificationsResult && 
        (notificationsResult.notifications?.length > 0 || notificationsResult.length > 0);

      if (hasRealNotifications) {
        const realNotifications = notificationsResult.notifications || notificationsResult;
        setNotifications(realNotifications);
      }

      console.log('✅ Data refreshed successfully');

    } catch (error) {
      console.error('Failed to refresh data:', error);
      alert('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('👋 User logging out');
      logout();
      setShowUserMenu(false);
    }
  };

  // NEW: Handle direct product purchase
  const handleBuyNow = (product) => {
    console.log('🛒 Buying product:', product.name);
    setCurrentOrder({
      type: 'single_product',
      product: product,
      buyer: {
        name: user?.name,
        email: user?.email
      }
    });
    setPaymentAmount(product.price * product.minOrder);
    setPaymentProduct(product.name);
    setShowPaystack(true);
  };

  // NEW: Handle cart checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    console.log('💰 Checking out cart:', { items: cartItems.length, totalAmount });
    
    setCurrentOrder({
      type: 'cart_checkout',
      items: cartItems,
      buyer: {
        name: user?.name,
        email: user?.email
      }
    });
    setPaymentAmount(totalAmount);
    setPaymentProduct('Cart Checkout');
    setShowPaystack(true);
  };

  // NEW: Handle successful Paystack payment
  const handlePaystackSuccess = async (paymentData) => {
    console.log('✅ Payment successful:', paymentData);
    
    try {
      // Record payment in backend
      await buyerService.recordPayment({
        amount: paymentData.amount,
        reference: paymentData.reference,
        transactionId: paymentData.transactionId,
        productName: paymentData.productName,
        orderType: paymentData.order.type
      });
      
      // Refresh data to show updates
      await refreshData();
      
      // Clear cart if it was a cart checkout
      if (paymentData.order.type === 'cart_checkout') {
        clearCart();
      }
      
      // Show success message
      alert(`Payment of KES ${paymentData.amount.toLocaleString()} completed successfully!`);
      
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Payment completed but failed to update records. Please contact support.');
    }
    
    setShowPaystack(false);
    setCurrentOrder(null);
  };

  // FIXED: Handle section navigation
  const handleSectionChange = (section) => {
    console.log('📱 Changing section to:', section);
    setActiveSection(section);
  };

  // FIXED: Safe quick stats with fallbacks
  const quickStats = {
    activeOrders: dashboardData?.overview?.activeOrders || 0,
    cartItems: totalItems,
    savedSuppliers: dashboardData?.overview?.favoriteSuppliersCount || 0,
    totalSpent: dashboardData?.overview?.totalSpent || 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 font-semibold">Loading your dashboard...</p>
          <p className="text-gray-600 text-sm mt-2">Preparing your buying experience</p>
        </div>
      </div>
    );
  }

  // FIXED: Render section with proper props
  const renderSection = () => {
    const commonProps = {
      searchQuery: activeSection === 'discovery' ? searchQuery : '',
      dashboardData: dashboardData,
      onDataUpdate: refreshData,
      usingMockData: usingMockData,
      onBuyNow: handleBuyNow, // NEW: Pass buy now handler
      onCheckout: handleCheckout // NEW: Pass checkout handler
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
              {/* Search Bar - FIXED */}
              <div className="hidden md:block">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products, suppliers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
              </div>

              {/* Notifications - FIXED */}
              <div className="relative">
                <button 
                  onClick={() => {
                    console.log('🔔 Toggling notifications');
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

              {/* Cart - FIXED */}
              <div className="relative">
                <button 
                  onClick={() => {
                    console.log('🛒 Toggling cart');
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

              {/* User Menu with Logout - FIXED */}
              <div className="relative">
                <button 
                  onClick={() => {
                    console.log('👤 Toggling user menu');
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

                {/* User Dropdown Menu - FIXED */}
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
                        console.log('📱 Navigating to payments');
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
                        console.log('⚙️ Navigating to settings');
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

      {/* Close dropdown when clicking outside - FIXED */}
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
          {/* Sidebar Navigation - FIXED */}
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

            {/* Quick Stats - FIXED */}
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
                  <span className="font-semibold text-gray-800">KSh {quickStats.totalSpent?.toLocaleString()}</span>
                </div>
              </div>
              {usingMockData && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                  💡 <strong>Live Demo:</strong> Mixed real + sample data
                </div>
              )}
              
              {/* Refresh Button - FIXED */}
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

      {/* Notifications Panel - FIXED */}
      {showNotifications && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      )}

      {/* Shopping Cart - FIXED */}
      {showCart && (
        <ShoppingCart
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout} // UPDATED: Use new checkout handler
        />
      )}

      {/* REAL Paystack Payment Modal */}
      {showPaystack && currentOrder && (
        <PaystackPayment
          order={currentOrder}
          amount={paymentAmount}
          productName={paymentProduct}
          onSuccess={handlePaystackSuccess}
          onClose={() => {
            setShowPaystack(false);
            setCurrentOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default BuyerDashboard;