// File: /src/pages/seller/Dashboard.jsx - OPTIMIZED WITH UNIFIED PAYMENT SYSTEM
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Package, Users, DollarSign, ShoppingCart, AlertTriangle,
  MapPin, Truck, MessageCircle, BarChart3, Plus, Filter,
  Search, Eye, Edit3, Trash2, Download, Share2, Phone, Send, Upload,
  Star, Clock, CheckCircle, XCircle, Building, X, LogOut, User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaystackPayment from '../../components/payments/PaystackPayment';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // 🔒 STRICT ROLE GUARD
  if (!user || (user.role !== 'input_seller' && user.role !== 'seller')) {
    console.log('🚫 SELLER DASHBOARD ACCESS DENIED: User role is', user?.role);
    return <Navigate to="/auth" replace />;
  }

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [showActionMessage, setShowActionMessage] = useState(false);
  
  // Payment state - USING UNIFIED SYSTEM
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);

  // Data states
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  
  // UI states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCustomerChat, setShowCustomerChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Seeds',
    price: '',
    stock: '',
    description: '',
    unit: 'kg'
  });

  // Enhanced mock data
  const generateEnhancedMockData = () => {
    return {
      inventory: [
        {
          id: 'prod_001',
          name: 'Premium Hybrid Maize Seeds',
          category: 'Seeds',
          price: 2500,
          stock: 150,
          description: 'High-yield hybrid maize seeds suitable for Kenyan climate conditions. Drought resistant and high germination rate.',
          image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400&h=300&fit=crop',
          status: 'active',
          unit: 'kg',
          minOrder: 1,
          rating: 4.8,
          reviews: 24,
          harvestTime: '90-120 days',
          certification: 'KEPHIS Certified'
        },
        {
          id: 'prod_002',
          name: 'Organic NPK Fertilizer',
          category: 'Fertilizers',
          price: 1800,
          stock: 3,
          description: 'Balanced NPK fertilizer for optimal plant growth. Organic composition suitable for all crops.',
          image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop',
          status: 'active',
          unit: 'bag',
          minOrder: 1,
          rating: 4.6,
          reviews: 18,
          coverage: '1 acre per bag',
          organic: true
        },
        {
          id: 'prod_003',
          name: 'Drip Irrigation Kit',
          category: 'Equipment',
          price: 12500,
          stock: 25,
          description: 'Complete drip irrigation system for efficient water usage. Includes pipes, emitters, and timer.',
          image: 'https://images.unsplash.com/photo-1620748699237-56e4c2c8ab29?w=400&h=300&fit=crop',
          status: 'active',
          unit: 'kit',
          minOrder: 1,
          rating: 4.9,
          reviews: 32,
          coverage: 'Up to 1/4 acre',
          warranty: '2 years'
        },
        {
          id: 'prod_004',
          name: 'Tomato Seeds F1 Hybrid',
          category: 'Seeds',
          price: 1200,
          stock: 80,
          description: 'High-quality tomato seeds with disease resistance and high yield potential.',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
          status: 'active',
          unit: 'pack',
          minOrder: 1,
          rating: 4.7,
          reviews: 15,
          harvestTime: '75-90 days',
          fruitSize: 'Medium to Large'
        }
      ],
      orders: [
        {
          id: 'ORD-001',
          customer: 'john@farmerscoop.com',
          customerName: 'John Kamau',
          product: 'Premium Hybrid Maize Seeds',
          amount: 5000,
          status: 'delivered',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          deliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          items: 2,
          customerPhone: '+254712345678',
          deliveryAddress: '123 Farm Road, Nakuru',
          transactionId: 'PS_00123456'
        },
        {
          id: 'ORD-002',
          customer: 'mary@greenfarm.com',
          customerName: 'Mary Wanjiku',
          product: 'Organic NPK Fertilizer',
          amount: 3600,
          status: 'processing',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          items: 2,
          customerPhone: '+254723456789',
          deliveryAddress: '456 Green Valley, Kiambu',
          transactionId: 'PS_00123457'
        },
        {
          id: 'ORD-003',
          customer: 'james@agriplus.com',
          customerName: 'James Mutiso',
          product: 'Drip Irrigation Kit',
          amount: 12500,
          status: 'pending_payment',
          date: new Date().toISOString().split('T')[0],
          items: 1,
          customerPhone: '+254734567890',
          deliveryAddress: '789 Hilltop, Machakos',
          transactionId: 'PS_00123458'
        }
      ],
      salesData: [
        { month: 'Jan', revenue: 45000, orders: 12 },
        { month: 'Feb', revenue: 52000, orders: 15 },
        { month: 'Mar', revenue: 61000, orders: 18 },
        { month: 'Apr', revenue: 58000, orders: 16 },
        { month: 'May', revenue: 72000, orders: 20 },
        { month: 'Jun', revenue: 68000, orders: 19 }
      ]
    };
  };

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
        const response = await fetch(`${API_BASE_URL}/seller/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          backendData = await response.json();
          console.log('✅ Seller dashboard data loaded:', backendData);
        }
      } catch (error) {
        console.log('⚠️ Using enhanced mock data:', error.message);
      }

      // Enhanced dashboard data
      const enhancedData = generateEnhancedMockData();
      
      // Merge with backend data if available
      if (backendData && Object.keys(backendData).length > 0) {
        setInventory(backendData.inventory || enhancedData.inventory);
        setOrders(backendData.orders || enhancedData.orders);
        setSalesData(backendData.salesData || enhancedData.salesData);
      } else {
        setInventory(enhancedData.inventory);
        setOrders(enhancedData.orders);
        setSalesData(enhancedData.salesData);
      }

      showMessage('🌱 Seller dashboard loaded successfully!');
      
    } catch (error) {
      console.error('Error loading seller dashboard:', error);
      showMessage('❌ Failed to load seller data');
      // Fallback to mock data
      const enhancedData = generateEnhancedMockData();
      setInventory(enhancedData.inventory);
      setOrders(enhancedData.orders);
      setSalesData(enhancedData.salesData);
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
  const handleQuickSale = (product) => {
    if (product.stock === 0) {
      showMessage('❌ This product is out of stock!');
      return;
    }
    if (product.status !== 'active') {
      showMessage('❌ This product is not available for sale!');
      return;
    }
    
    const customerEmail = prompt('Enter customer email for payment receipt:');
    if (!customerEmail) {
      showMessage('❌ Customer email is required for payment');
      return;
    }

    const customerPhone = prompt('Enter customer phone number (optional):') || '';
    const customerName = prompt('Enter customer name (optional):') || 'Customer';

    const totalAmount = product.price * product.minOrder;
    
    setPaymentConfig({
      amount: totalAmount,
      productName: `${product.name} - ${product.minOrder} ${product.unit}`,
      email: customerEmail,
      description: `Purchase of ${product.minOrder} ${product.unit} ${product.name} from ${businessName}`,
      userType: 'seller',
      metadata: {
        productId: product.id,
        productName: product.name,
        sellerId: user.id,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        customerName: customerName
      }
    });
    setShowPaymentModal(true);
    
    showMessage(`🛒 Preparing quick sale for ${product.name}...`);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('✅ Payment successful:', paymentData);
    setShowPaymentModal(false);
    
    showMessage(`✅ Payment Successful! KES ${paymentData.amount} received for ${paymentData.productName}`);
    
    // Update inventory and create order
    const product = inventory.find(p => p.id === paymentData.metadata?.productId);
    if (product) {
      // Update inventory
      setInventory(prev => prev.map(item => 
        item.id === product.id ? { ...item, stock: item.stock - product.minOrder } : item
      ));

      // Create new order
      const newOrder = {
        id: `ORD-${Date.now()}`,
        customer: paymentData.metadata?.customerEmail,
        customerName: paymentData.metadata?.customerName,
        product: product.name,
        amount: paymentData.amount,
        status: 'paid',
        date: new Date().toISOString().split('T')[0],
        items: product.minOrder,
        customerPhone: paymentData.metadata?.customerPhone,
        deliveryAddress: 'To be confirmed',
        transactionId: paymentData.reference
      };

      setOrders(prev => [newOrder, ...prev]);
    }
    
    // Refresh dashboard data
    loadDashboardData();
  };

  // ✅ OPTIMIZED: Product management functions
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showMessage('❌ Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showMessage('❌ Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      showMessage('✅ Image selected successfully!');
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) {
      showMessage('❌ Please enter a product name');
      return;
    }
    if (!newProduct.price || parseInt(newProduct.price) <= 0) {
      showMessage('❌ Please enter a valid price');
      return;
    }
    if (!newProduct.stock || parseInt(newProduct.stock) < 0) {
      showMessage('❌ Please enter a valid stock quantity');
      return;
    }
    if (!imagePreview) {
      showMessage('❌ Please upload a product photo');
      return;
    }

    try {
      const productData = {
        id: `prod_${Date.now()}`,
        name: newProduct.name.trim(),
        category: newProduct.category,
        price: parseInt(newProduct.price),
        stock: parseInt(newProduct.stock),
        description: newProduct.description.trim(),
        unit: newProduct.unit,
        image: imagePreview,
        status: 'active',
        minOrder: 1,
        rating: 0,
        reviews: 0
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInventory(prev => [productData, ...prev]);
      closeAddProductModal();
      showMessage(`✅ ${productData.name} added successfully!`);
    } catch (error) {
      showMessage('❌ Failed to save product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setInventory(inventory.filter(p => p.id !== productId));
        showMessage('✅ Product deleted successfully!');
      } catch (error) {
        showMessage('❌ Failed to delete product. Please try again.');
      }
    }
  };

  // ✅ OPTIMIZED: Navigation and UI functions
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('👋 Seller logging out');
      await logout();
      navigate('/');
    }
  };

  const closeAddProductModal = () => {
    setShowAddProductModal(false);
    setSelectedImage(null);
    setImagePreview('');
    setNewProduct({
      name: '',
      category: 'Seeds',
      price: '',
      stock: '',
      description: '',
      unit: 'kg'
    });
  };

  const filteredProducts = inventory.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const businessName = user?.businessName || user?.profile?.businessName || user?.companyName || user?.name || 'AgriBusiness';
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const activeProducts = inventory.filter(p => p.status === 'active').length;
  const lowStockItems = inventory.filter(item => item.stock <= 5).length;
  const pendingOrders = orders.filter(order => order.status === 'pending_payment' || order.status === 'processing').length;

  const stats = [
    { 
      title: 'Total Revenue', 
      value: `KES ${totalRevenue.toLocaleString()}`, 
      change: '+12%', 
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Total Orders', 
      value: orders.length.toString(), 
      change: '+8%', 
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Active Products', 
      value: activeProducts.toString(), 
      change: '+5%', 
      icon: <Package className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Low Stock Items', 
      value: lowStockItems.toString(), 
      change: lowStockItems > 0 ? 'Attention Needed' : 'All Good', 
      icon: <AlertTriangle className="h-6 w-6" />,
      color: lowStockItems > 0 ? 'text-orange-600' : 'text-green-600',
      bgColor: lowStockItems > 0 ? 'bg-orange-50' : 'bg-green-50'
    }
  ];

  const LoadingSpinner = ({ message = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === 'overview' && loading) return <LoadingSpinner message="Loading dashboard..." />;
    if (activeTab === 'products' && loading) return <LoadingSpinner message="Loading products..." />;

    switch (activeTab) {
      case 'products':
        return (
          <div className="bg-white rounded-lg shadow-lg border">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Product Catalog</h2>
                  <p className="text-gray-600 mt-1">Manage your agricultural products</p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setShowAddProductModal(true)} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-lg">
                    <Plus className="h-5 w-5 mr-2" /> Add Product
                  </button>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 shadow-sm"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 shadow-sm bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Fertilizers">Fertilizers</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Pesticides">Pesticides</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
            </div>
            <div className="overflow-hidden">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <button onClick={() => setShowAddProductModal(true)} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                    <Plus className="h-5 w-5 mr-2 inline" /> Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border-b border-gray-200 last:border-b-0 hover:bg-green-50 transition-all duration-300">
                      <div className="px-6 py-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 flex-1">
                            <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover shadow-md" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>{product.status}</span>
                                {product.organic && (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    🌱 Organic
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3">{product.description}</p>
                              <div className="flex items-center space-x-6">
                                <span className="text-2xl font-bold text-green-600">KES {product.price.toLocaleString()}</span>
                                <span className={`text-lg font-semibold ${
                                  product.stock <= 5 ? 'text-red-600 animate-pulse' : 'text-green-600'
                                }`}>{product.stock} in stock</span>
                                <span className="text-gray-500">Min order: {product.minOrder} {product.unit}</span>
                                {product.rating && (
                                  <span className="flex items-center text-yellow-600">
                                    <Star className="h-4 w-4 fill-current mr-1" />
                                    {product.rating} ({product.reviews})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => handleQuickSale(product)} 
                              disabled={product.stock === 0} 
                              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all font-semibold shadow-md"
                            >
                              Quick Sale
                            </button>
                            <div className="flex flex-col space-y-2">
                              <button 
                                onClick={() => handleDeleteProduct(product.id)} 
                                className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'overview':
      default:
        return (
          <div className="space-y-6">
            {/* Action Message */}
            {showActionMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {actionMessage}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white overflow-hidden shadow-lg rounded-xl border hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 rounded-xl p-4 ${stat.bgColor} shadow-md`}>
                        <div className={stat.color}>{stat.icon}</div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className={`ml-2 text-sm font-semibold ${
                              stat.change.includes('+') ? 'text-green-600' : 
                              stat.change.includes('Attention') ? 'text-orange-600' : 'text-red-600'
                            }`}>{stat.change}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white shadow-lg rounded-xl border">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white rounded-t-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Product Inventory</h3>
                        <p className="text-gray-600 mt-1">{inventory.length} products • {lowStockItems} low stock</p>
                      </div>
                      <div className="flex space-x-3">
                        <button onClick={() => setActiveTab('products')} className="text-green-600 hover:text-green-700 font-medium">View All</button>
                        <button onClick={() => setShowAddProductModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-md">
                          <Plus className="h-4 w-4 mr-2" /> Add Product
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {inventory.slice(0, 5).map((product) => (
                      <div key={product.id} className="px-6 py-4 hover:bg-green-50 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover shadow-sm" />
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.category} • KES {product.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              product.stock <= 5 ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-green-100 text-green-800'
                            }`}>{product.stock} in stock</div>
                            <button 
                              onClick={() => handleQuickSale(product)} 
                              disabled={product.stock === 0} 
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all font-medium shadow-sm"
                            >
                              Quick Sale
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white shadow-lg rounded-xl border">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
                    <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
                    <p className="text-gray-600 mt-1">{orders.length} total orders • {pendingOrders} pending</p>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order.id} className="px-6 py-4 hover:bg-blue-50 transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{order.customerName || order.customer}</p>
                            <p className="text-sm text-gray-600">{order.product}</p>
                            <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">KES {order.amount.toLocaleString()}</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'paid' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>{order.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">🌱 {businessName}</h1>
                <p className="text-sm text-gray-600 mt-1">Agricultural Inputs Seller Dashboard</p>
              </div>
              <nav className="ml-12 flex space-x-8">
                {['overview', 'products', 'analytics', 'delivery'].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`capitalize px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                      activeTab === tab ? 'text-green-600 bg-green-50 shadow-inner' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <span>{tab === 'overview' ? '📊' : tab === 'products' ? '📦' : tab === 'analytics' ? '📈' : '🚚'}</span>
                    <span>{tab}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{businessName}</p>
                <p className="text-sm text-gray-500">Premium Agricultural Seller</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all font-semibold"
                >
                  <LogOut className="h-5 w-5" /> <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">{renderTabContent()}</div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-auto shadow-2xl border border-green-200">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Package className="h-8 w-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Add New Product</h3>
                    <p className="text-green-100 mt-1">Expand your agricultural catalog</p>
                  </div>
                </div>
                <button onClick={closeAddProductModal} className="text-white hover:text-green-200 text-xl font-semibold p-2 hover:bg-green-500 rounded-lg">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Product Photo *</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover shadow-md" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Product Name *</label>
                  <input 
                    type="text" 
                    value={newProduct.name} 
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-green-500" 
                    placeholder="Hybrid Maize Seeds" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Category *</label>
                  <select 
                    value={newProduct.category} 
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} 
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Price (KES) *</label>
                  <input 
                    type="number" 
                    value={newProduct.price} 
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-green-500" 
                    placeholder="1500" 
                    min="1" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Stock Quantity *</label>
                  <input 
                    type="number" 
                    value={newProduct.stock} 
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} 
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-green-500" 
                    placeholder="50" 
                    min="0" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Unit *</label>
                  <select 
                    value={newProduct.unit} 
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})} 
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="bag">Bag</option>
                    <option value="pack">Pack</option>
                    <option value="piece">Piece</option>
                    <option value="litre">Litre</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Product Description</label>
                <textarea 
                  value={newProduct.description} 
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
                  rows="4" 
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-green-500" 
                  placeholder="Describe your product features, benefits, and usage instructions..." 
                />
              </div>
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button onClick={handleAddProduct} className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg font-bold text-lg">Add Product</button>
                <button onClick={closeAddProductModal} className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-all font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ OPTIMIZED: Unified Paystack Payment Modal */}
      {showPaymentModal && paymentConfig && (
        <PaystackPayment
          amount={paymentConfig.amount}
          email={paymentConfig.email}
          productName={paymentConfig.productName}
          description={paymentConfig.description}
          userType={paymentConfig.userType}
          metadata={paymentConfig.metadata}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;