// src/pages/FarmerDashboard.jsx - OPTIMIZED WITH UNIFIED PAYMENT SYSTEM
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaystackPayment from '../components/payments/PaystackPayment';
import TabNavigation from '../components/dashboard/TabNavigation';
import OverviewTab from '../components/dashboard/farmer/OverviewTab';
import ProductsTab from '../components/dashboard/farmer/ProductsTab';
import OrdersTab from '../components/dashboard/farmer/OrdersTab';
import FarmProfileTab from '../components/dashboard/farmer/FarmProfileTab';
import FinancialTab from '../components/dashboard/farmer/FinancialTab';
import ExpertConnectTab from '../components/dashboard/farmer/ExpertConnectTab';
import CommunityTab from '../components/dashboard/farmer/CommunityTab';

const FarmerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [showActionMessage, setShowActionMessage] = useState(false);
  
  // Payment state - USING UNIFIED SYSTEM
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);

  // Dashboard data state
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

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [user]);

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
        const response = await fetch(`${API_BASE_URL}/farmer/dashboard`, {
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
        console.log('⚠️ Using enhanced mock data:', error.message);
      }

      // Enhanced mock data with more realistic information
      const enhancedData = {
        stats: backendData.stats || {
          totalEarnings: 187500,
          pendingOrders: 5,
          activeProducts: 12,
          expertSessions: 3,
          communityMembers: 67,
          monthlyGrowth: 15,
          completedOrders: 28,
          totalCustomers: 45,
          farmSize: '5 acres'
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
            description: 'High quality organic maize, freshly harvested',
            image: '🌽',
            harvestDate: '2024-01-15',
            quality: 'Grade A'
          },
          { 
            id: 2, 
            name: 'Beans', 
            price: 80, 
            quantity: 50, 
            unit: 'kg', 
            status: 'available', 
            category: 'Legumes',
            description: 'Fresh beans from our farm, rich in protein',
            image: '🫘',
            harvestDate: '2024-01-10',
            quality: 'Grade A+'
          },
          { 
            id: 3, 
            name: 'Tomatoes', 
            price: 40, 
            quantity: 25, 
            unit: 'kg', 
            status: 'low-stock', 
            category: 'Vegetables',
            description: 'Fresh red tomatoes, perfect for cooking',
            image: '🍅',
            harvestDate: '2024-01-18',
            quality: 'Grade A'
          },
          { 
            id: 4, 
            name: 'Avocados', 
            price: 30, 
            quantity: 75, 
            unit: 'piece', 
            status: 'available', 
            category: 'Fruits',
            description: 'Hass avocados, creamy and delicious',
            image: '🥑',
            harvestDate: '2024-01-12',
            quality: 'Premium'
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
            buyerEmail: 'john@traders.com',
            deliveryAddress: 'Nairobi CBD, Moi Avenue',
            paymentStatus: 'paid'
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
            buyerEmail: 'orders@marketco.com',
            deliveryAddress: 'Westlands, Nairobi',
            paymentStatus: 'pending'
          },
          { 
            id: 3, 
            product: 'Tomatoes', 
            buyer: 'Restaurant Fresh', 
            quantity: 15, 
            price: 40, 
            status: 'processing', 
            date: '2024-01-17', 
            total: 600,
            buyerEmail: 'orders@freshrestaurant.com',
            deliveryAddress: 'Karen, Nairobi',
            paymentStatus: 'paid'
          }
        ],
        farmData: backendData.farmData || {
          name: `${user?.name || 'My'}'s Organic Farm`,
          location: { lat: -1.2921, lng: 36.8219, address: 'Kiambu County' },
          size: '5 acres',
          soilType: 'Volcanic',
          crops: ['Maize', 'Beans', 'Tomatoes', 'Avocados'],
          irrigation: 'Drip System',
          farmerName: user?.name || 'Farmer',
          farmerEmail: user?.email || 'farmer@example.com',
          established: '2018',
          certification: 'Organic',
          workers: 4
        },
        financialData: backendData.financialData || {
          totalIncome: 75000,
          totalExpenses: 25000,
          netProfit: 50000,
          pendingPayments: 8000,
          monthlyTarget: 100000,
          recentTransactions: [
            { id: 1, type: 'income', amount: 15000, description: 'Maize Sale to John Traders', date: '2024-01-15' },
            { id: 2, type: 'expense', amount: 5000, description: 'Seeds and Fertilizers', date: '2024-01-14' },
            { id: 3, type: 'income', amount: 8000, description: 'Beans Bulk Order', date: '2024-01-12' },
            { id: 4, type: 'expense', amount: 3000, description: 'Equipment Maintenance', date: '2024-01-10' }
          ]
        },
        notifications: backendData.notifications || [
          { id: 1, type: 'order', message: 'New order received for Tomatoes from Restaurant Fresh', time: '2 hours ago', read: false },
          { id: 2, type: 'weather', message: 'Rain expected tomorrow - prepare irrigation accordingly', time: '5 hours ago', read: true },
          { id: 3, type: 'payment', message: 'Payment received for Beans order - KES 1,000', time: '1 day ago', read: true },
          { id: 4, type: 'market', message: 'High demand for Avocados in local market', time: '2 days ago', read: false }
        ],
        experts: backendData.experts || [
          { 
            id: 1, 
            name: 'Dr. Jane Wanjiku', 
            specialty: 'Crop Diseases & Pest Control', 
            rating: 4.8, 
            available: true, 
            fee: 1500,
            email: 'jane@agriexpert.com',
            phone: '+254712345678',
            experience: '15 years',
            successRate: '92%'
          },
          { 
            id: 2, 
            name: 'Prof. James Maina', 
            specialty: 'Soil Science & Fertilization', 
            rating: 4.9, 
            available: true, 
            fee: 2000,
            email: 'james@agriexpert.com',
            phone: '+254723456789',
            experience: '20 years',
            successRate: '95%'
          },
          { 
            id: 3, 
            name: 'Dr. Grace Akinyi', 
            specialty: 'Organic Farming & Certification', 
            rating: 4.7, 
            available: false, 
            fee: 1800,
            email: 'grace@organicexpert.com',
            phone: '+254734567890',
            experience: '12 years',
            successRate: '88%'
          }
        ],
        communityPosts: backendData.communityPosts || [
          { 
            id: 1, 
            user: 'John Farmer', 
            content: 'Anyone experiencing maize rust this season? Need advice on organic treatment methods.', 
            likes: 12, 
            comments: 8, 
            time: '3 hours ago',
            userImage: '👨‍🌾',
            userFarm: 'Green Valley Farm'
          },
          { 
            id: 2, 
            user: 'Mary Wanjiku', 
            content: 'Just harvested my tomatoes! Best yield this season thanks to the new irrigation system! 🍅 #harvest #success', 
            likes: 25, 
            comments: 15, 
            time: '5 hours ago',
            userImage: '👩‍🌾',
            userFarm: 'Sunrise Organics'
          },
          { 
            id: 3, 
            user: 'Peter Kamau', 
            content: 'Sharing my experience with companion planting - marigolds with tomatoes really help with pest control! 🌼🍅', 
            likes: 18, 
            comments: 12, 
            time: '1 day ago',
            userImage: '🧑‍🌾',
            userFarm: 'Kamau Family Farm'
          }
        ]
      };

      setDashboardData(enhancedData);
      showMessage('🌱 Farm dashboard loaded successfully!');
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showMessage('❌ Failed to load farm data');
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

  // ✅ OPTIMIZED: Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('👋 Farmer logging out');
      await logout();
      navigate('/');
    }
  };

  // ✅ OPTIMIZED: Update functions
  const updateProducts = (newProducts) => {
    console.log('🔄 Updating products:', newProducts);
    setDashboardData(prev => ({ ...prev, products: newProducts }));
    showMessage('✅ Products updated successfully!');
  };

  const updateOrders = (newOrders) => {
    console.log('🔄 Updating orders:', newOrders);
    setDashboardData(prev => ({ ...prev, orders: newOrders }));
    showMessage('✅ Orders updated successfully!');
  };

  const updateFarmData = (newFarmData) => {
    console.log('🔄 Updating farm data:', newFarmData);
    setDashboardData(prev => ({ ...prev, farmData: newFarmData }));
    showMessage('✅ Farm profile updated successfully!');
  };

  const addNotification = (notification) => {
    console.log('🔔 Adding notification:', notification);
    setDashboardData(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications]
    }));
  };

  // ✅ OPTIMIZED: Payment functions using unified system
  const handleRequestPayment = (order) => {
    console.log('💰 Requesting payment for order:', order);
    setPaymentConfig({
      amount: order.total,
      productName: `Farm Produce Order - ${order.product}`,
      email: order.buyerEmail || 'buyer@example.com',
      description: `Order #${order.id} - ${order.quantity} ${order.unit} of ${order.product}`,
      userType: 'farmer'
    });
    setShowPaymentModal(true);
    showMessage(`💰 Payment request sent to ${order.buyer}`);
  };

  const handlePayForExpert = (expert) => {
    console.log('🎓 Paying for expert consultation:', expert);
    setPaymentConfig({
      amount: expert.fee,
      productName: `Expert Consultation - ${expert.name}`,
      email: user?.email || 'farmer@example.com',
      description: `Professional consultation with ${expert.name} - ${expert.specialty}`,
      userType: 'farmer'
    });
    setShowPaymentModal(true);
    showMessage(`🎓 Booking consultation with ${expert.name}`);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('✅ Payment successful:', paymentData);
    setShowPaymentModal(false);
    
    showMessage(`✅ Payment Successful! KES ${paymentData.amount} received for ${paymentData.productName}`);
    
    // Update orders status if it was an order payment
    if (paymentData.productName.includes('Order')) {
      const updatedOrders = dashboardData.orders.map(order => {
        if (paymentData.productName.includes(order.product)) {
          return { ...order, paymentStatus: 'paid' };
        }
        return order;
      });
      updateOrders(updatedOrders);
    }
    
    // Update financial data
    setDashboardData(prev => ({
      ...prev,
      financialData: {
        ...prev.financialData,
        totalIncome: prev.financialData.totalIncome + paymentData.amount,
        pendingPayments: Math.max(0, prev.financialData.pendingPayments - paymentData.amount)
      }
    }));
  };

  // ✅ OPTIMIZED: Product management functions
  const handleAddProduct = (newProduct) => {
    console.log('➕ Adding new product:', newProduct);
    const productWithId = {
      ...newProduct,
      id: Date.now(),
      image: getProductImage(newProduct.category),
      harvestDate: new Date().toISOString().split('T')[0],
      quality: 'Grade A'
    };
    updateProducts([...dashboardData.products, productWithId]);
    showMessage(`✅ ${newProduct.name} added to your products!`);
  };

  const handleUpdateProduct = (productId, updatedProduct) => {
    console.log('✏️ Updating product:', productId, updatedProduct);
    const updatedProducts = dashboardData.products.map(product =>
      product.id === productId ? { ...product, ...updatedProduct } : product
    );
    updateProducts(updatedProducts);
    showMessage(`✅ Product updated successfully!`);
  };

  const handleDeleteProduct = (productId) => {
    console.log('🗑️ Deleting product:', productId);
    const product = dashboardData.products.find(p => p.id === productId);
    const updatedProducts = dashboardData.products.filter(product => product.id !== productId);
    updateProducts(updatedProducts);
    showMessage(`✅ ${product?.name} removed from your products`);
  };

  // ✅ OPTIMIZED: Order management functions
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    console.log('📦 Updating order status:', orderId, newStatus);
    const order = dashboardData.orders.find(o => o.id === orderId);
    const updatedOrders = dashboardData.orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    updateOrders(updatedOrders);
    showMessage(`✅ Order ${orderId} marked as ${newStatus}`);
  };

  // ✅ OPTIMIZED: Expert consultation functions
  const handleBookExpert = (expert) => {
    console.log('📅 Booking expert:', expert);
    showMessage(`📅 Booking consultation with ${expert.name}...`);
    
    // Show payment modal
    handlePayForExpert(expert);
  };

  const handleContactExpert = (expert) => {
    console.log('📞 Contacting expert:', expert);
    showMessage(`📞 Contacting ${expert.name} at ${expert.phone}...`);
    // In a real app, this would open phone dialer or email client
    window.open(`tel:${expert.phone}`, '_self');
  };

  // ✅ OPTIMIZED: Community functions
  const handleAddPost = (newPost) => {
    console.log('💬 Adding new post:', newPost);
    const postWithId = {
      ...newPost,
      id: Date.now(),
      user: user?.name || 'Farmer',
      userImage: '👨‍🌾',
      userFarm: dashboardData.farmData?.name || 'My Farm',
      likes: 0,
      comments: 0,
      time: 'Just now'
    };
    setDashboardData(prev => ({
      ...prev,
      communityPosts: [postWithId, ...prev.communityPosts]
    }));
    showMessage('💬 Post published to community!');
  };

  const handleLikePost = (postId) => {
    console.log('👍 Liking post:', postId);
    const updatedPosts = dashboardData.communityPosts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setDashboardData(prev => ({ ...prev, communityPosts: updatedPosts }));
    showMessage('👍 Post liked!');
  };

  const handleAddComment = (postId, comment) => {
    console.log('💬 Adding comment to post:', postId, comment);
    const updatedPosts = dashboardData.communityPosts.map(post =>
      post.id === postId ? { ...post, comments: post.comments + 1 } : post
    );
    setDashboardData(prev => ({ ...prev, communityPosts: updatedPosts }));
    showMessage('💬 Comment added!');
  };

  // ✅ OPTIMIZED: Helper function for product images
  const getProductImage = (category) => {
    const images = {
      'Cereals': '🌽',
      'Legumes': '🫘',
      'Vegetables': '🍅',
      'Fruits': '🍎',
      'Grains': '🌾',
      'Spices': '🌶️',
      'Dairy': '🥛',
      'Poultry': '🐔'
    };
    return images[category] || '🌱';
  };

  // Calculate unread notifications
  const unreadNotifications = dashboardData.notifications.filter(n => !n.read).length;

  // Mark notification as read
  const markNotificationAsRead = (notificationId) => {
    setDashboardData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Your Farm Dashboard...</p>
          <p className="text-sm text-gray-500">Preparing your farming data</p>
        </div>
      </div>
    );
  }

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
              <p className="text-green-600">
                {dashboardData.farmData?.name || 'Your Farm'} • {dashboardData.stats.farmSize} • Season: Planting 🌱
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications Badge */}
              {unreadNotifications > 0 && (
                <div className="relative">
                  <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {unreadNotifications}
                  </div>
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

      {/* Action Message */}
      {showActionMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {actionMessage}
          </div>
        </div>
      )}

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
            onMarkNotificationRead={markNotificationAsRead}
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

export default FarmerDashboard;