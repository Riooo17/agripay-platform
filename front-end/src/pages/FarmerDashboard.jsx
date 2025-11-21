// src/pages/FarmerDashboard.jsx - COMPLETELY FIXED WITH WORKING BUTTONS
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TabNavigation from '../components/dashboard/TabNavigation';
import OverviewTab from '../components/dashboard/farmer/OverviewTab';
import ProductsTab from '../components/dashboard/farmer/ProductsTab';
import OrdersTab from '../components/dashboard/farmer/OrdersTab';
import FarmProfileTab from '../components/dashboard/farmer/FarmProfileTab';
import FinancialTab from '../components/dashboard/farmer/FinancialTab';
import ExpertConnectTab from '../components/dashboard/farmer/ExpertConnectTab';
import CommunityTab from '../components/dashboard/farmer/CommunityTab';

// REAL Paystack Payment Component for Farmer - FIXED
const PaystackPayment = ({ 
  amount, 
  email, 
  productName, 
  description,
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

  // REAL Paystack Integration for Farmer
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
    const reference = 'FARMER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    console.log('💰 Farmer Payment Initializing:', {
      product: productName,
      amount,
      reference
    });

    try {
      // Create payment handler
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: email || 'farmer@example.com',
        amount: amount, // Already in kobo
        currency: 'KES',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Service Type",
              variable_name: "service_type",
              value: "Farmer Payment"
            },
            {
              display_name: "Product", 
              variable_name: "product_name",
              value: productName
            },
            {
              display_name: "Description",
              variable_name: "description",
              value: description
            }
          ]
        },
        callback: function(response) {
          // Payment successful
          console.log('✅ Farmer Payment successful:', response);
          
          setLoading(false);
          onSuccess({
            amount: amount / 100, // Convert back to KES
            reference: response.reference,
            transactionId: response.transaction,
            status: 'success',
            productName: productName
          });
        },
        onClose: function() {
          // Payment window closed
          console.log('Farmer payment window closed');
          setLoading(false);
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('❌ Farmer Payment initialization error:', error);
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
              <span className="text-2xl">🌱</span>
              <div>
                <h3 className="text-xl font-bold">Complete Payment</h3>
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
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Service:</span>
              <span className="font-semibold text-gray-800">{productName}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Description:</span>
              <span className="font-semibold text-gray-800 text-sm">{description}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="text-2xl font-bold text-green-600">
                KES {(amount / 100)?.toLocaleString()}
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

const FarmerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    products: [],
    orders: [],
    farmData: null,
    financialData: {},
    notifications: [],
    experts: [],
    communityPosts: []
  });

  // FIXED: Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);

  // FIXED: Load data from backend combined with mock data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Try to fetch from backend first
        const token = localStorage.getItem('agripay_token');
        let backendData = {};
        
        try {
          const response = await fetch('http://localhost:5000/api/farmer/dashboard', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            backendData = await response.json();
            console.log('✅ Backend data loaded:', backendData);
          }
        } catch (error) {
          console.log('⚠️ Using mock data - backend not available');
        }

        // Combine backend data with mock data
        const combinedData = {
          stats: backendData.stats || {
            totalEarnings: 187500,
            pendingOrders: 5,
            activeProducts: 12,
            expertSessions: 3,
            communityMembers: 67,
            monthlyGrowth: 15,
            completedOrders: 28
          },
          products: backendData.products || [
            { 
              id: 1, 
              name: 'Maize', 
              price: 50, 
              quantity: 100, 
              unit: 'kg', 
              status: 'available', 
              category: 'Cereals',
              description: 'High quality organic maize',
              image: '🌽'
            },
            { 
              id: 2, 
              name: 'Beans', 
              price: 80, 
              quantity: 50, 
              unit: 'kg', 
              status: 'available', 
              category: 'Legumes',
              description: 'Fresh beans from our farm',
              image: '🫘'
            },
            { 
              id: 3, 
              name: 'Tomatoes', 
              price: 40, 
              quantity: 25, 
              unit: 'kg', 
              status: 'low-stock', 
              category: 'Vegetables',
              description: 'Fresh red tomatoes',
              image: '🍅'
            }
          ],
          orders: backendData.orders || [
            { 
              id: 1, 
              product: 'Maize', 
              buyer: 'John Traders', 
              quantity: 20, 
              price: 50, 
              status: 'completed', 
              date: '2024-01-15', 
              total: 1000,
              buyerEmail: 'john@traders.com'
            },
            { 
              id: 2, 
              product: 'Beans', 
              buyer: 'Market Co.', 
              quantity: 10, 
              price: 80, 
              status: 'pending', 
              date: '2024-01-16', 
              total: 800,
              buyerEmail: 'orders@marketco.com'
            }
          ],
          farmData: backendData.farmData || {
            name: `${user?.name || 'My'}'s Farm`,
            location: { lat: -1.2921, lng: 36.8219 },
            size: '5 acres',
            soilType: 'Volcanic',
            crops: ['Maize', 'Beans', 'Tomatoes'],
            irrigation: 'Drip System',
            farmerName: user?.name || 'Farmer',
            farmerEmail: user?.email || 'farmer@example.com'
          },
          financialData: backendData.financialData || {
            totalIncome: 75000,
            totalExpenses: 25000,
            netProfit: 50000,
            pendingPayments: 8000,
            recentTransactions: [
              { id: 1, type: 'income', amount: 15000, description: 'Maize Sale', date: '2024-01-15' },
              { id: 2, type: 'expense', amount: 5000, description: 'Seeds Purchase', date: '2024-01-14' }
            ]
          },
          notifications: backendData.notifications || [
            { id: 1, type: 'order', message: 'New order received for Tomatoes', time: '2 hours ago', read: false },
            { id: 2, type: 'weather', message: 'Rain expected tomorrow', time: '5 hours ago', read: true },
            { id: 3, type: 'payment', message: 'Payment received for Beans order', time: '1 day ago', read: true }
          ],
          experts: backendData.experts || [
            { 
              id: 1, 
              name: 'Dr. Jane Wanjiku', 
              specialty: 'Crop Diseases', 
              rating: 4.8, 
              available: true, 
              fee: 1500,
              email: 'jane@agriexpert.com',
              phone: '+254712345678'
            },
            { 
              id: 2, 
              name: 'Prof. James Maina', 
              specialty: 'Soil Science', 
              rating: 4.9, 
              available: true, 
              fee: 2000,
              email: 'james@agriexpert.com',
              phone: '+254723456789'
            }
          ],
          communityPosts: backendData.communityPosts || [
            { 
              id: 1, 
              user: 'John Farmer', 
              content: 'Anyone experiencing maize rust? Need advice on treatment.', 
              likes: 12, 
              comments: 8, 
              time: '3 hours ago',
              userImage: '👨‍🌾'
            },
            { 
              id: 2, 
              user: 'Mary Wanjiku', 
              content: 'Just harvested my tomatoes! Best yield this season! 🍅', 
              likes: 25, 
              comments: 15, 
              time: '5 hours ago',
              userImage: '👩‍🌾'
            }
          ]
        };

        setDashboardData(combinedData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [user]);

  // FIXED: Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('👋 Farmer logging out');
      await logout();
      navigate('/');
    }
  };

  // FIXED: Update functions
  const updateProducts = (newProducts) => {
    console.log('🔄 Updating products:', newProducts);
    setDashboardData(prev => ({ ...prev, products: newProducts }));
    addNotification({
      id: Date.now(),
      type: 'success',
      message: 'Products updated successfully!',
      time: 'Just now',
      read: false
    });
  };

  const updateOrders = (newOrders) => {
    console.log('🔄 Updating orders:', newOrders);
    setDashboardData(prev => ({ ...prev, orders: newOrders }));
    addNotification({
      id: Date.now(),
      type: 'success',
      message: 'Orders updated successfully!',
      time: 'Just now',
      read: false
    });
  };

  const updateFarmData = (newFarmData) => {
    console.log('🔄 Updating farm data:', newFarmData);
    setDashboardData(prev => ({ ...prev, farmData: newFarmData }));
    addNotification({
      id: Date.now(),
      type: 'success',
      message: 'Farm profile updated successfully!',
      time: 'Just now',
      read: false
    });
  };

  const addNotification = (notification) => {
    console.log('🔔 Adding notification:', notification);
    setDashboardData(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications]
    }));
  };

  // FIXED: Payment functions
  const handleRequestPayment = (order) => {
    console.log('💰 Requesting payment for order:', order);
    setPaymentConfig({
      amount: order.total * 100, // Convert to kobo
      productName: `Payment for ${order.product} Order`,
      email: order.buyerEmail || 'buyer@example.com',
      description: `Order #${order.id} - ${order.quantity} ${order.unit} of ${order.product}`
    });
    setShowPaymentModal(true);
  };

  const handlePayForExpert = (expert) => {
    console.log('🎓 Paying for expert consultation:', expert);
    setPaymentConfig({
      amount: expert.fee * 100, // Convert to kobo
      productName: `Expert Consultation - ${expert.name}`,
      email: user?.email || 'farmer@example.com',
      description: `Consultation with ${expert.name} - ${expert.specialty}`
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('✅ Payment successful:', paymentData);
    setShowPaymentModal(false);
    addNotification({
      id: Date.now(),
      type: 'success',
      message: `Payment of KES ${paymentData.amount} received successfully!`,
      time: 'Just now',
      read: false
    });
    
    // Update orders status if it was an order payment
    if (paymentData.productName.includes('Order')) {
      const updatedOrders = dashboardData.orders.map(order => {
        if (paymentData.productName.includes(order.product)) {
          return { ...order, status: 'paid' };
        }
        return order;
      });
      updateOrders(updatedOrders);
    }
  };

  // FIXED: Product management functions
  const handleAddProduct = (newProduct) => {
    console.log('➕ Adding new product:', newProduct);
    const productWithId = {
      ...newProduct,
      id: Date.now(),
      image: getProductImage(newProduct.category)
    };
    updateProducts([...dashboardData.products, productWithId]);
  };

  const handleUpdateProduct = (productId, updatedProduct) => {
    console.log('✏️ Updating product:', productId, updatedProduct);
    const updatedProducts = dashboardData.products.map(product =>
      product.id === productId ? { ...product, ...updatedProduct } : product
    );
    updateProducts(updatedProducts);
  };

  const handleDeleteProduct = (productId) => {
    console.log('🗑️ Deleting product:', productId);
    const updatedProducts = dashboardData.products.filter(product => product.id !== productId);
    updateProducts(updatedProducts);
  };

  // FIXED: Order management functions
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    console.log('📦 Updating order status:', orderId, newStatus);
    const updatedOrders = dashboardData.orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    updateOrders(updatedOrders);
  };

  // FIXED: Expert consultation functions
  const handleBookExpert = (expert) => {
    console.log('📅 Booking expert:', expert);
    addNotification({
      id: Date.now(),
      type: 'info',
      message: `Booking consultation with ${expert.name}...`,
      time: 'Just now',
      read: false
    });
    
    // Show payment modal
    handlePayForExpert(expert);
  };

  const handleContactExpert = (expert) => {
    console.log('📞 Contacting expert:', expert);
    addNotification({
      id: Date.now(),
      type: 'info',
      message: `Contacting ${expert.name} at ${expert.phone}...`,
      time: 'Just now',
      read: false
    });
  };

  // FIXED: Community functions
  const handleAddPost = (newPost) => {
    console.log('💬 Adding new post:', newPost);
    const postWithId = {
      ...newPost,
      id: Date.now(),
      user: user?.name || 'Farmer',
      userImage: '👨‍🌾',
      likes: 0,
      comments: 0,
      time: 'Just now'
    };
    setDashboardData(prev => ({
      ...prev,
      communityPosts: [postWithId, ...prev.communityPosts]
    }));
    addNotification({
      id: Date.now(),
      type: 'success',
      message: 'Post published to community!',
      time: 'Just now',
      read: false
    });
  };

  const handleLikePost = (postId) => {
    console.log('👍 Liking post:', postId);
    const updatedPosts = dashboardData.communityPosts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setDashboardData(prev => ({ ...prev, communityPosts: updatedPosts }));
  };

  const handleAddComment = (postId, comment) => {
    console.log('💬 Adding comment to post:', postId, comment);
    const updatedPosts = dashboardData.communityPosts.map(post =>
      post.id === postId ? { ...post, comments: post.comments + 1 } : post
    );
    setDashboardData(prev => ({ ...prev, communityPosts: updatedPosts }));
  };

  // FIXED: Helper function for product images
  const getProductImage = (category) => {
    const images = {
      'Cereals': '🌽',
      'Legumes': '🫘',
      'Vegetables': '🍅',
      'Fruits': '🍎',
      'Grains': '🌾',
      'Spices': '🌶️'
    };
    return images[category] || '🌱';
  };

  // FIXED: Calculate unread notifications
  const unreadNotifications = dashboardData.notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name || 'Farmer'} 👨‍🌾
              </h1>
              <p className="text-green-600">Manage your farming business efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications Badge */}
              {unreadNotifications > 0 && (
                <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {unreadNotifications}
                </div>
              )}
              
              <div className="bg-orange-100 px-4 py-2 rounded-lg border border-orange-300">
                <p className="text-orange-800 font-semibold">Season: Planting 🌱</p>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewTab 
            data={dashboardData}
            onTabChange={setActiveTab}
            onAddNotification={addNotification}
            onRequestPayment={handleRequestPayment}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
        {activeTab === 'products' && (
          <ProductsTab 
            products={dashboardData.products}
            onUpdateProducts={updateProducts}
            onAddNotification={addNotification}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
        {activeTab === 'orders' && (
          <OrdersTab 
            orders={dashboardData.orders}
            onUpdateOrders={updateOrders}
            onAddNotification={addNotification}
            onRequestPayment={handleRequestPayment}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
        {activeTab === 'farm-profile' && (
          <FarmProfileTab 
            farmData={dashboardData.farmData}
            onUpdateFarmData={updateFarmData}
            onAddNotification={addNotification}
          />
        )}
        {activeTab === 'financial' && (
          <FinancialTab 
            data={dashboardData.financialData}
            transactions={dashboardData.orders}
            onAddNotification={addNotification}
            onRequestPayment={handleRequestPayment}
          />
        )}
        {activeTab === 'expert-connect' && (
          <ExpertConnectTab 
            experts={dashboardData.experts}
            onAddNotification={addNotification}
            onBookExpert={handleBookExpert}
            onContactExpert={handleContactExpert}
            onPayForExpert={handlePayForExpert}
          />
        )}
        {activeTab === 'community' && (
          <CommunityTab 
            posts={dashboardData.communityPosts}
            onAddNotification={addNotification}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
          />
        )}
      </div>

      {/* FIXED: Paystack Payment Modal */}
      {showPaymentModal && paymentConfig && (
        <PaystackPayment
          amount={paymentConfig.amount}
          email={paymentConfig.email}
          productName={paymentConfig.productName}
          description={paymentConfig.description}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default FarmerDashboard;