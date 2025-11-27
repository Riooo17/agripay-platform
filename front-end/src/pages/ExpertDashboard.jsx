// src/pages/ExpertDashboard.jsx - OPTIMIZED WITH UNIFIED PAYMENT SYSTEM
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaystackPayment from '../components/payments/PaystackPayment';
import AgriPayAfricaMap from '../components/maps/AgriPayAfricaMap';
import expertService from '../services/expertService';

const ExpertDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [showActionMessage, setShowActionMessage] = useState(false);
  
  // Payment state - USING UNIFIED SYSTEM
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);

  // Dashboard data states
  const [dashboardData, setDashboardData] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [knowledgeContent, setKnowledgeContent] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [clients, setClients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Knowledge Hub states
  const [knowledgeAction, setKnowledgeAction] = useState(null);
  const [currentArticle, setCurrentArticle] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [scheduleData, setScheduleData] = useState({
    title: '',
    date: '',
    time: '14:00',
    duration: '60',
    type: 'video'
  });

  // Enhanced mock data
  const enhancedMockConsultations = [
    {
      _id: '1',
      farmerName: 'John Kamau',
      farmerEmail: 'john@example.com',
      farmerPhone: '+254712345678',
      farmerLocation: 'Nakuru',
      consultationType: 'video',
      issueType: 'Maize disease identification',
      description: 'Need help identifying brown spots on maize leaves affecting my 2-acre farm. The spots appear 3 weeks after planting.',
      offeredAmount: 1500,
      status: 'pending',
      createdAt: new Date(),
      farmSize: '2 acres',
      cropType: 'Maize',
      urgency: 'High'
    },
    {
      _id: '2',
      farmerName: 'Mary Wanjiku',
      farmerEmail: 'mary@example.com',
      farmerPhone: '+254723456789',
      farmerLocation: 'Kiambu',
      consultationType: 'field_visit',
      issueType: 'Soil fertility assessment',
      description: 'Soil testing and fertility improvement recommendations for vegetable farming. Previous season yield was low.',
      offeredAmount: 3000,
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      farmSize: '1.5 acres',
      cropType: 'Mixed Vegetables',
      urgency: 'Medium'
    },
    {
      _id: '3',
      farmerName: 'James Mutiso',
      farmerEmail: 'james@example.com',
      farmerPhone: '+254734567890',
      farmerLocation: 'Machakos',
      consultationType: 'video',
      issueType: 'Pest control',
      description: 'Tomato pests destroying my greenhouse crops. Tried organic pesticides but no improvement.',
      offeredAmount: 2000,
      status: 'accepted',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '14:00',
      farmSize: '0.5 acres',
      cropType: 'Tomatoes',
      urgency: 'High'
    },
    {
      _id: '4',
      farmerName: 'Grace Achieng',
      farmerEmail: 'grace@example.com',
      farmerPhone: '+254745678901',
      farmerLocation: 'Kisumu',
      consultationType: 'phone',
      issueType: 'Irrigation planning',
      description: 'Need advice on setting up drip irrigation system for my fruit farm near Lake Victoria.',
      offeredAmount: 2500,
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      farmSize: '3 acres',
      cropType: 'Mangoes & Oranges',
      urgency: 'Medium'
    }
  ];

  const enhancedMockKnowledgeContent = [
    {
      _id: '1',
      type: 'article',
      title: 'Maize Blight Prevention Techniques',
      content: `Maize blight is a common fungal disease that affects maize crops across Africa. Here are effective prevention techniques:

1. **Crop Rotation**: Rotate maize with legumes like beans or peas to break disease cycles
2. **Resistant Varieties**: Use certified blight-resistant maize varieties
3. **Field Sanitation**: Remove and destroy infected plant debris after harvest
4. **Proper Spacing**: Ensure adequate spacing (75cm between rows, 25cm between plants)
5. **Organic Fungicides**: Apply neem-based solutions or copper fungicides preventively
6. **Soil Health**: Maintain optimal soil pH (6.0-7.0) and organic matter content

Early detection is key! Monitor fields weekly during the growing season.`,
      views: 1250,
      likes: 89,
      comments: [
        { _id: '1', userName: 'Farmer Joe', comment: 'This saved my harvest! Thank you!', timestamp: new Date('2024-01-12') },
        { _id: '2', userName: 'Agri Expert', comment: 'Great advice! I would add regular soil testing.', timestamp: new Date('2024-01-13') }
      ],
      status: 'published',
      createdAt: new Date('2024-01-10'),
      tags: ['maize', 'disease', 'prevention', 'organic']
    },
    {
      _id: '2',
      type: 'video',
      title: 'Compost Preparation Guide',
      scheduledDate: '2024-01-25',
      scheduledTime: '10:00',
      duration: 60,
      views: 890,
      likes: 67,
      status: 'scheduled',
      description: 'Learn how to create high-quality compost using locally available materials'
    },
    {
      _id: '3',
      type: 'webinar',
      title: 'Organic Pest Management Workshop',
      scheduledDate: '2024-01-30',
      scheduledTime: '15:00',
      duration: 90,
      views: 0,
      likes: 0,
      status: 'scheduled',
      description: 'Live session on natural pest control methods for small-scale farmers',
      attendees: 45
    }
  ];

  const enhancedMockClients = [
    {
      _id: '1',
      name: 'John Kamau',
      email: 'john@example.com',
      phone: '+254712345678',
      location: 'Nakuru',
      totalConsultations: 5,
      totalSpent: 7500,
      rating: 5,
      lastConsultation: new Date('2024-01-15'),
      farmType: 'Maize & Beans',
      joinDate: new Date('2023-08-10')
    },
    {
      _id: '2',
      name: 'Mary Wanjiku',
      email: 'mary@example.com',
      phone: '+254723456789',
      location: 'Kiambu',
      totalConsultations: 3,
      totalSpent: 9000,
      rating: 4,
      lastConsultation: new Date('2024-01-10'),
      farmType: 'Vegetables',
      joinDate: new Date('2023-11-15')
    },
    {
      _id: '3',
      name: 'James Mutiso',
      email: 'james@example.com',
      phone: '+254734567890',
      location: 'Machakos',
      totalConsultations: 2,
      totalSpent: 4000,
      rating: 5,
      lastConsultation: new Date('2024-01-08'),
      farmType: 'Greenhouse Tomatoes',
      joinDate: new Date('2023-12-20')
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
        const response = await fetch(`${API_BASE_URL}/expert/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          backendData = await response.json();
          console.log('✅ Expert dashboard data loaded:', backendData);
        }
      } catch (error) {
        console.log('⚠️ Using enhanced mock data:', error.message);
      }

      // Enhanced dashboard data
      const enhancedData = {
        stats: backendData.stats || {
          totalConsultations: 89,
          pendingConsultations: 4,
          completedConsultations: 84,
          totalEarnings: 215000,
          rating: 4.8,
          responseRate: 98,
          farmersHelped: 156
        },
        expert: backendData.expert || {
          specialization: 'Crop Science & Soil Management',
          experience: '8 years',
          education: 'MSc Agricultural Sciences',
          certifications: ['Certified Agronomist', 'Organic Farming Expert', 'IPM Specialist'],
          languages: ['English', 'Swahili', 'Kikuyu'],
          serviceAreas: ['Central Kenya', 'Rift Valley', 'Western Kenya'],
          hourlyRate: 2000,
          bio: 'Dedicated to sustainable agriculture and farmer empowerment across East Africa.'
        }
      };

      setDashboardData(enhancedData);
      setConsultations(enhancedMockConsultations);
      setKnowledgeContent(enhancedMockKnowledgeContent);
      setClients(enhancedMockClients);
      
      // Enhanced analytics data
      setAnalyticsData({
        impactMetrics: {
          farmersHelped: 156,
          successRate: 94,
          yieldImprovement: 35,
          costReduction: 28,
          satisfactionRate: 96
        },
        consultationStats: {
          total: 89,
          completed: 84,
          pending: 5,
          revenue: 215000,
          averageRating: 4.8
        },
        monthlyEarnings: [
          { _id: 'Jan', earnings: 45000, consultations: 12 },
          { _id: 'Feb', earnings: 52000, consultations: 15 },
          { _id: 'Mar', earnings: 61000, consultations: 18 },
          { _id: 'Apr', earnings: 58000, consultations: 16 },
          { _id: 'May', earnings: 72000, consultations: 20 },
          { _id: 'Jun', earnings: 68000, consultations: 19 }
        ],
        serviceDistribution: {
          'Crop Diseases': 35,
          'Soil Management': 25,
          'Pest Control': 20,
          'Irrigation': 15,
          'Other': 5
        }
      });

      showMessage('🎓 Expert dashboard loaded successfully!');
      
    } catch (error) {
      console.error('Error loading expert dashboard:', error);
      showMessage('❌ Failed to load expert data');
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
  const handleAcceptConsultation = (consultation) => {
    console.log('🔄 Accepting consultation:', consultation._id);
    
    setPaymentConfig({
      amount: consultation.offeredAmount,
      productName: `Expert Consultation - ${consultation.farmerName}`,
      email: consultation.farmerEmail || 'farmer@example.com',
      description: `Agricultural consultation for: ${consultation.issueType}. Farm: ${consultation.farmSize} of ${consultation.cropType}`,
      userType: 'expert'
    });
    setShowPaymentModal(true);
    
    // Update local state immediately
    setConsultations(prev => 
      prev.map(cons => 
        cons._id === consultation._id 
          ? { ...cons, status: 'accepted' }
          : cons
      )
    );
    
    showMessage(`✅ Consultation accepted for ${consultation.farmerName}. Payment request sent.`);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('✅ Payment successful:', paymentData);
    setShowPaymentModal(false);
    
    showMessage(`✅ Payment Successful! KES ${paymentData.amount} received for ${paymentData.productName}`);
    
    // Update analytics data
    if (analyticsData) {
      setAnalyticsData(prev => ({
        ...prev,
        consultationStats: {
          ...prev.consultationStats,
          revenue: prev.consultationStats.revenue + paymentData.amount
        }
      }));
    }
  };

  // ✅ OPTIMIZED: Consultation management functions
  const handleCompleteConsultation = (consultationId) => {
    const consultation = consultations.find(c => c._id === consultationId);
    setConsultations(prev => 
      prev.map(cons => 
        cons._id === consultationId 
          ? { ...cons, status: 'completed' }
          : cons
      )
    );
    showMessage(`✅ Consultation with ${consultation.farmerName} marked as completed!`);
  };

  const handleRejectConsultation = (consultationId) => {
    const consultation = consultations.find(c => c._id === consultationId);
    setConsultations(prev => 
      prev.map(cons => 
        cons._id === consultationId 
          ? { ...cons, status: 'rejected' }
          : cons
      )
    );
    showMessage(`❌ Consultation request from ${consultation.farmerName} rejected`);
  };

  // ✅ OPTIMIZED: Knowledge Hub functions
  const handlePublishArticle = () => {
    if (!currentArticle.trim()) {
      showMessage('❌ Please write an article before publishing.');
      return;
    }

    const articleData = {
      _id: Date.now().toString(),
      type: 'article',
      title: currentArticle.split('\n')[0].substring(0, 50) + (currentArticle.split('\n')[0].length > 50 ? '...' : ''),
      content: currentArticle,
      views: 0,
      likes: 0,
      comments: [],
      status: 'published',
      createdAt: new Date(),
      tags: ['expert-advice', 'agriculture']
    };

    setKnowledgeContent(prev => [articleData, ...prev]);
    setCurrentArticle('');
    setKnowledgeAction(null);
    showMessage('✅ Article published successfully!');
  };

  const handleScheduleVideo = () => {
    if (!scheduleData.title.trim() || !scheduleData.date) {
      showMessage('❌ Please fill all scheduling details.');
      return;
    }

    const videoData = {
      _id: Date.now().toString(),
      type: 'video',
      title: scheduleData.title,
      scheduledDate: scheduleData.date,
      scheduledTime: scheduleData.time,
      duration: parseInt(scheduleData.duration),
      views: 0,
      likes: 0,
      status: 'scheduled',
      createdAt: new Date()
    };

    setKnowledgeContent(prev => [videoData, ...prev]);
    setScheduleData({ title: '', date: '', time: '14:00', duration: '60', type: 'video' });
    setKnowledgeAction(null);
    showMessage('🎥 Video scheduled successfully!');
  };

  const handleScheduleWebinar = () => {
    if (!scheduleData.title.trim() || !scheduleData.date) {
      showMessage('❌ Please fill all scheduling details.');
      return;
    }

    const webinarData = {
      _id: Date.now().toString(),
      type: 'webinar',
      title: scheduleData.title,
      scheduledDate: scheduleData.date,
      scheduledTime: scheduleData.time,
      duration: parseInt(scheduleData.duration),
      views: 0,
      likes: 0,
      status: 'scheduled',
      createdAt: new Date(),
      attendees: 0
    };

    setKnowledgeContent(prev => [webinarData, ...prev]);
    setScheduleData({ title: '', date: '', time: '14:00', duration: '60', type: 'webinar' });
    setKnowledgeAction(null);
    showMessage('🔴 Webinar scheduled successfully!');
  };

  const handleAddComment = (articleId, comment) => {
    if (!comment.trim()) {
      showMessage('❌ Please enter a comment.');
      return;
    }

    setKnowledgeContent(prev => 
      prev.map(item => 
        item._id === articleId 
          ? {
              ...item,
              comments: [
                ...(item.comments || []),
                {
                  _id: Date.now().toString(),
                  userName: user?.name || 'You',
                  comment: comment,
                  timestamp: new Date()
                }
              ]
            }
          : item
      )
    );
    setNewComment('');
    showMessage('💬 Comment added successfully!');
  };

  const handleLikeContent = (contentId) => {
    setKnowledgeContent(prev => 
      prev.map(item => 
        item._id === contentId 
          ? { ...item, likes: (item.likes || 0) + 1 }
          : item
      )
    );
    showMessage('👍 Content liked!');
  };

  // ✅ OPTIMIZED: Client management functions
  const handleContactClient = (client) => {
    showMessage(`📞 Contacting ${client.name} at ${client.phone}...`);
    // In real app, this would open phone dialer or email client
    setTimeout(() => {
      showMessage(`✅ Call initiated to ${client.name}`);
    }, 1000);
  };

  // ✅ OPTIMIZED: Profile functions
  const handleEditProfile = () => {
    showMessage('📝 Profile editor opening soon...');
  };

  const handleSetAvailability = () => {
    showMessage('📅 Availability settings updated!');
  };

  const handleSetRates = () => {
    showMessage('💰 Rate settings updated!');
  };

  const handleUpdateServiceAreas = () => {
    showMessage('📍 Service areas updated!');
  };

  // ✅ OPTIMIZED: Support and logout
  const handleSupportClick = () => {
    showMessage('🛟 Support request received! Our team will contact you within 5 minutes.');
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('👋 Expert logging out');
      await logout();
      navigate('/');
    }
  };

  // Helper functions
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Notification functions
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Expert Dashboard...</p>
          <p className="text-sm text-gray-500">Preparing your professional workspace</p>
        </div>
      </div>
    );
  }

  // UI COMPONENTS
  const LoadingSpinner = ({ size = 'medium' }) => (
    <div className={`flex justify-center items-center ${
      size === 'large' ? 'py-12' : 'py-4'
    }`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );

  // MAIN COMPONENTS

  // 1. DASHBOARD OVERVIEW
  const DashboardOverview = () => {
    const stats = dashboardData?.stats || {};
    const expert = dashboardData?.expert || {};
    const pendingConsultations = consultations.filter(c => c.status === 'pending');

    return (
      <div className="space-y-6">
        {/* Action Message */}
        {showActionMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {actionMessage}
          </div>
        )}

        {/* Welcome Header with Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-blue-100">Your expertise is transforming African agriculture</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{pendingConsultations.length}</div>
              <div className="text-sm">Pending Consultations</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">KES {stats.totalEarnings?.toLocaleString() || '0'}</div>
              <div className="text-sm">Total Earnings</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.rating || '4.8'}</div>
              <div className="text-sm">Average Rating</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.farmersHelped || '0'}</div>
              <div className="text-sm">Farmers Helped</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('consultations')}
            className="bg-white border-2 border-blue-500 rounded-xl p-4 text-center hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="font-semibold text-blue-700">Manage Consultations</div>
            <div className="text-sm text-gray-600 mt-1">{pendingConsultations.length} pending</div>
          </button>
          <button 
            onClick={() => setActiveTab('knowledge')}
            className="bg-white border-2 border-yellow-500 rounded-xl p-4 text-center hover:bg-yellow-50 transition-colors"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold text-yellow-700">Knowledge Hub</div>
            <div className="text-sm text-gray-600 mt-1">Share your expertise</div>
          </button>
          <button 
            onClick={() => setActiveTab('earnings')}
            className="bg-white border-2 border-green-500 rounded-xl p-4 text-center hover:bg-green-50 transition-colors"
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="font-semibold text-green-700">View Earnings</div>
            <div className="text-sm text-gray-600 mt-1">Track your income</div>
          </button>
        </div>

        {/* Pending Consultations */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Pending Consultation Requests</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {pendingConsultations.length} new
            </span>
          </div>
          <div className="space-y-4">
            {pendingConsultations.map(consultation => (
              <div key={consultation._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {consultation.farmerName?.charAt(0) || 'F'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{consultation.farmerName}</h3>
                        <p className="text-gray-600 text-sm">{consultation.consultationType} • {consultation.farmerLocation}</p>
                        <p className="text-gray-500 text-xs">{consultation.farmerEmail}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{consultation.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                        KES {consultation.offeredAmount}
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-medium">
                        {consultation.issueType}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                        {consultation.farmSize} • {consultation.cropType}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleAcceptConsultation(consultation)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Accept & Request Payment
                    </button>
                    <button 
                      onClick={() => handleRejectConsultation(consultation._id)}
                      className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingConsultations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📭</div>
                <p>No pending consultation requests</p>
                <p className="text-sm">New requests will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 2. CONSULTATION MANAGEMENT
  const ConsultationManagement = () => {
    const pendingConsultations = consultations.filter(c => c.status === 'pending');
    const acceptedConsultations = consultations.filter(c => c.status === 'accepted');
    const today = new Date().toISOString().split('T')[0];
    const todaySchedule = acceptedConsultations.filter(c => c.scheduledDate === today);

    return (
      <div className="space-y-6">
        {/* Action Message */}
        {showActionMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Consultation Management</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 max-h-80 overflow-y-auto">
                {todaySchedule.map((consultation) => (
                  <div key={consultation._id} className="bg-white border border-blue-200 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-blue-700">
                        {consultation.scheduledTime || '10:00'} - {consultation.farmerName}
                      </div>
                      <div className="text-sm text-gray-600">{consultation.consultationType}</div>
                      <div className="text-xs text-gray-500">{consultation.issueType}</div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">{consultation.status}</span>
                      <button 
                        onClick={() => handleCompleteConsultation(consultation._id)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
                {todaySchedule.length === 0 && <p className="text-center text-gray-500 py-4">No consultations scheduled for today</p>}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleSetAvailability} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors text-center">
                    <div className="text-xl mb-1">📅</div>
                    <div className="text-sm font-medium">Set Availability</div>
                  </button>
                  <button onClick={() => setActiveTab('clients')} className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors text-center">
                    <div className="text-xl mb-1">👥</div>
                    <div className="text-sm font-medium">Client List</div>
                  </button>
                  <button onClick={handleSetRates} className="bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 transition-colors text-center">
                    <div className="text-xl mb-1">💰</div>
                    <div className="text-sm font-medium">Set Rates</div>
                  </button>
                  <button onClick={() => setActiveTab('analytics')} className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors text-center">
                    <div className="text-xl mb-1">📊</div>
                    <div className="text-sm font-medium">Reports</div>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <AgriPayAfricaMap height="300px" showServiceAreas={true} expertLocation={user?.location || "Nairobi"} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={handleUpdateServiceAreas} className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">Update Areas</button>
                <button onClick={() => setActiveTab('analytics')} className="border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">View Analytics</button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">All Consultation Requests</h3>
            <div className="space-y-4">
              {consultations.map(consultation => (
                <div key={consultation._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {consultation.farmerName?.charAt(0) || 'F'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{consultation.farmerName}</h4>
                          <p className="text-gray-600 text-sm">{consultation.consultationType} • {consultation.farmerLocation}</p>
                          <p className="text-gray-500 text-sm">{consultation.issueType}</p>
                        </div>
                      </div>
                      <p className="text-gray-700">{consultation.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">KES {consultation.offeredAmount}</div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        consultation.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>{consultation.status}</span>
                      <div className="mt-2 space-y-1">
                        {consultation.status === 'pending' && (
                          <>
                            <button onClick={() => handleAcceptConsultation(consultation)} className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors">Accept</button>
                            <button onClick={() => handleRejectConsultation(consultation._id)} className="w-full border border-red-300 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-50 transition-colors">Reject</button>
                          </>
                        )}
                        {consultation.status === 'accepted' && (
                          <button onClick={() => handleCompleteConsultation(consultation._id)} className="w-full bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors">Complete</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 3. KNOWLEDGE HUB
  const KnowledgeHub = () => {
    const articles = knowledgeContent.filter(item => item.type === 'article');
    const videos = knowledgeContent.filter(item => item.type === 'video');
    const webinars = knowledgeContent.filter(item => item.type === 'webinar');

    return (
      <div className="space-y-6">
        {/* Action Message */}
        {showActionMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Knowledge Hub</h2>
          
          {/* Content Creation Interface */}
          {knowledgeAction === 'article' && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Write Your Article</h3>
              <textarea 
                value={currentArticle} 
                onChange={(e) => setCurrentArticle(e.target.value)} 
                placeholder="Write your article here... You can include tips, techniques, or insights for farmers." 
                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <div className="flex space-x-3 mt-4">
                <button onClick={handlePublishArticle} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">📝 Publish Article</button>
                <button onClick={() => { setKnowledgeAction(null); setCurrentArticle(''); }} className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {knowledgeAction === 'video' && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Schedule Video Recording</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                  <input type="text" value={scheduleData.title} onChange={(e) => setScheduleData({...scheduleData, title: e.target.value})} placeholder="Enter video title..." className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recording Date</label>
                  <input type="date" value={scheduleData.date} onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})} min={getTodayDate()} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input type="time" value={scheduleData.time} onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select value={scheduleData.duration} onChange={(e) => setScheduleData({...scheduleData, duration: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button onClick={handleScheduleVideo} className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold">🎥 Schedule Video</button>
                <button onClick={() => { setKnowledgeAction(null); setScheduleData({ title: '', date: '', time: '14:00', duration: '60', type: 'video' }); }} className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {knowledgeAction === 'webinar' && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Schedule Live Webinar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Webinar Title</label>
                  <input type="text" value={scheduleData.title} onChange={(e) => setScheduleData({...scheduleData, title: e.target.value})} placeholder="Enter webinar title..." className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Webinar Date</label>
                  <input type="date" value={scheduleData.date} onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})} min={getTodayDate()} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input type="time" value={scheduleData.time} onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select value={scheduleData.duration} onChange={(e) => setScheduleData({...scheduleData, duration: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button onClick={handleScheduleWebinar} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">🔴 Schedule Webinar</button>
                <button onClick={() => { setKnowledgeAction(null); setScheduleData({ title: '', date: '', time: '14:00', duration: '60', type: 'webinar' }); }} className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {!knowledgeAction && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button onClick={() => setKnowledgeAction('article')} className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors text-center">
                <div className="text-3xl mb-3">📝</div>
                <div className="font-semibold">Write Article</div>
                <div className="text-blue-100 text-sm mt-2">Share your expertise</div>
              </button>
              <button onClick={() => { setScheduleData({ title: '', date: getTomorrowDate(), time: '14:00', duration: '60', type: 'video' }); setKnowledgeAction('video'); }} className="bg-yellow-600 text-white p-6 rounded-xl hover:bg-yellow-700 transition-colors text-center">
                <div className="text-3xl mb-3">🎥</div>
                <div className="font-semibold">Schedule Video</div>
                <div className="text-yellow-100 text-sm mt-2">Plan video recording</div>
              </button>
              <button onClick={() => { setScheduleData({ title: '', date: getTomorrowDate(), time: '14:00', duration: '60', type: 'webinar' }); setKnowledgeAction('webinar'); }} className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition-colors text-center">
                <div className="text-3xl mb-3">🔴</div>
                <div className="font-semibold">Schedule Webinar</div>
                <div className="text-green-100 text-sm mt-2">Plan live session</div>
              </button>
            </div>
          )}

          {/* Content Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Video Tutorials */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-gray-800">Your Video Schedule</h3>
              <div className="space-y-4">
                {videos.map(video => (
                  <div key={video._id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{video.title}</h4>
                        <p className="text-gray-600 text-sm">
                          📅 {new Date(video.scheduledDate).toLocaleDateString()} at 🕒 {video.scheduledTime}
                        </p>
                        <p className="text-gray-500 text-sm">Duration: {video.duration} minutes</p>
                        <div className="flex space-x-4 mt-2">
                          <span className="text-sm text-gray-600">👁️ {video.views} views</span>
                          <button 
                            onClick={() => handleLikeContent(video._id)}
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            👍 {video.likes} likes
                          </button>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        video.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {video.status}
                      </span>
                    </div>
                  </div>
                ))}
                {videos.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No videos scheduled yet.</p>
                )}
              </div>
            </div>

            {/* Webinars */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-gray-800">Your Webinar Schedule</h3>
              <div className="space-y-4">
                {webinars.map(webinar => (
                  <div key={webinar._id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{webinar.title}</h4>
                        <p className="text-gray-600 text-sm">
                          📅 {new Date(webinar.scheduledDate).toLocaleDateString()} at 🕒 {webinar.scheduledTime}
                        </p>
                        <p className="text-gray-500 text-sm">Duration: {webinar.duration} minutes</p>
                        <div className="flex space-x-4 mt-2">
                          <span className="text-sm text-gray-600">👥 {webinar.attendees || 0} attendees</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        webinar.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {webinar.status}
                      </span>
                    </div>
                  </div>
                ))}
                {webinars.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No webinars scheduled yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Articles</h3>
            <div className="space-y-4">
              {articles.map(article => (
                <div key={article._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 
                        className="font-semibold text-lg text-gray-800 cursor-pointer hover:text-blue-600"
                        onClick={() => setSelectedArticle(selectedArticle?._id === article._id ? null : article)}
                      >
                        {article.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Published on {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-4 mt-3">
                        <span className="flex items-center space-x-1 text-gray-600">
                          <span>👁️</span>
                          <span>{article.views} views</span>
                        </span>
                        <button 
                          onClick={() => handleLikeContent(article._id)}
                          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <span>👍</span>
                          <span>{article.likes} likes</span>
                        </button>
                        <span 
                          className="flex items-center space-x-1 text-gray-600 cursor-pointer hover:text-blue-600"
                          onClick={() => setSelectedArticle(selectedArticle?._id === article._id ? null : article)}
                        >
                          <span>💬</span>
                          <span>{article.comments?.length || 0} comments</span>
                        </span>
                      </div>

                      {/* Article Content and Comments */}
                      {selectedArticle?._id === article._id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="prose max-w-none mb-4 whitespace-pre-line">
                            {article.content}
                          </div>
                          
                          <div className="mt-6">
                            <h5 className="font-semibold mb-3">Comments ({article.comments?.length || 0})</h5>
                            <div className="space-y-3 mb-4">
                              {article.comments?.map(comment => (
                                <div key={comment._id} className="bg-gray-50 rounded-lg p-3">
                                  <div className="font-semibold text-sm">{comment.userName}</div>
                                  <p className="text-gray-700 text-sm">{comment.comment}</p>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {new Date(comment.timestamp).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(article._id, newComment)}
                              />
                              <button
                                onClick={() => handleAddComment(article._id, newComment)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {articles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">📝</div>
                  <p>No articles yet. Create your first content!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 4. EARNINGS & FINANCE
  const EarningsFinance = () => {
    if (!analyticsData) return <LoadingSpinner size="large" />;

    const monthlyEarnings = analyticsData.monthlyEarnings || [];
    const totalEarnings = monthlyEarnings.reduce((sum, month) => sum + (month.earnings || 0), 0);
    const totalConsultations = monthlyEarnings.reduce((sum, month) => sum + (month.consultations || 0), 0);
    const avgPerConsultation = totalConsultations > 0 ? Math.round(totalEarnings / totalConsultations) : 0;

    return (
      <div className="space-y-6">
        {/* Action Message */}
        {showActionMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Earnings & Finance</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Earnings Overview</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-3xl font-bold text-green-600">KES {totalEarnings.toLocaleString()}</div>
                    <div className="text-gray-600">Total Earnings</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">+15%</div>
                    <div className="text-gray-600">from last period</div>
                  </div>
                </div>
                
                <div className="flex items-end justify-between h-32 mt-6 space-x-2">
                  {monthlyEarnings.slice(-6).map((month, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-green-500 rounded-t w-full transition-all hover:bg-green-600 cursor-pointer" 
                        style={{ height: `${((month.earnings || 0) / 80000) * 100}%` }} 
                        title={`${month._id}: KES ${month.earnings} - ${month.consultations} consultations`} 
                      />
                      <div className="text-xs text-gray-600 mt-2">{month._id}</div>
                      <div className="text-xs font-semibold">KES {((month.earnings || 0) / 1000).toFixed(0)}K</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-green-600 font-bold text-2xl">KES {totalEarnings.toLocaleString()}</div>
                  <div className="text-green-800">Total Earnings</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-blue-600 font-bold text-2xl">{totalConsultations}</div>
                  <div className="text-blue-800">Total Consultations</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-yellow-600 font-bold text-2xl">KES {avgPerConsultation.toLocaleString()}</div>
                  <div className="text-yellow-800">Average per Consultation</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {clients.slice(0, 5).map(client => (
                <div key={client._id} className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <div>
                    <div className="font-semibold text-gray-800">{client.name}</div>
                    <div className="text-gray-600 text-sm">{client.totalConsultations} consultations • {new Date(client.lastConsultation).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold">KES {client.totalSpent?.toLocaleString()}</div>
                    <div className="text-green-500 text-sm">✓ Completed</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 5. CLIENT MANAGEMENT
  const ClientManagement = () => {
    const totalConsultations = clients.reduce((acc, client) => acc + client.totalConsultations, 0);
    const averageRating = clients.length > 0 ? (clients.reduce((acc, client) => acc + (client.rating || 4), 0) / clients.length).toFixed(1) : '0';

    return (
      <div className="space-y-6">
        {/* Action Message */}
        {showActionMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Client Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-blue-600 font-bold text-3xl">{clients.length}</div>
              <div className="text-blue-800 font-semibold">Active Clients</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-green-600 font-bold text-3xl">{totalConsultations}</div>
              <div className="text-green-800 font-semibold">Total Consultations</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 text-center">
              <div className="text-yellow-600 font-bold text-3xl">{averageRating}★</div>
              <div className="text-yellow-800 font-semibold">Average Rating</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Your Clients</h3>
            {clients.map(client => (
              <div key={client._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                      {client.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{client.name}</h4>
                      <p className="text-gray-600 text-sm">{client.location}</p>
                      <p className="text-gray-500 text-sm">{client.phone} • {client.email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">{client.totalConsultations} consultations</span>
                        <span className="text-yellow-500 text-sm">{"★".repeat(Math.round(client.rating || 4))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold">KES {client.totalSpent?.toLocaleString() || '0'}</div>
                    <div className="text-gray-500 text-sm mt-1">
                      Last: {new Date(client.lastConsultation).toLocaleDateString()}
                    </div>
                    <button 
                      onClick={() => handleContactClient(client)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {clients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">👥</div>
                <p>No clients yet</p>
                <p className="text-sm">Clients will appear here after consultations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 6. ANALYTICS
  const Analytics = () => {
    if (!analyticsData) return <LoadingSpinner size="large" />;

    const impactMetrics = analyticsData.impactMetrics || {};
    const consultationStats = analyticsData.consultationStats || {};

    return (
      <div className="space-y-6">
        {/* Action Message */}
        {showActionMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Performance Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="text-blue-600 font-bold text-3xl">{impactMetrics.farmersHelped || '0'}</div>
              <div className="text-blue-800 font-semibold">Farmers Helped</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="text-green-600 font-bold text-3xl">{impactMetrics.successRate || '0'}%</div>
              <div className="text-green-800 font-semibold">Success Rate</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 text-center">
              <div className="text-yellow-600 font-bold text-3xl">{impactMetrics.yieldImprovement || '0'}%</div>
              <div className="text-yellow-800 font-semibold">Yield Improvement</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="text-purple-600 font-bold text-3xl">{impactMetrics.costReduction || '0'}%</div>
              <div className="text-purple-800 font-semibold">Cost Reduction</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Consultation Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Total Consultations</span>
                  <span className="font-semibold text-gray-800">{consultationStats.total || '0'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Completed</span>
                  <span className="font-semibold text-green-600">{consultationStats.completed || '0'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Success Rate</span>
                  <span className="font-semibold text-blue-600">
                    {consultationStats.total > 0 ? Math.round((consultationStats.completed / consultationStats.total) * 100) : '0'}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Revenue Generated</span>
                  <span className="font-semibold text-green-600">
                    KES {consultationStats.revenue?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Knowledge Impact</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Articles Published</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{knowledgeContent.filter(item => item.type === 'article').length}</div>
                    <div className="text-xs text-gray-600">
                      {knowledgeContent.filter(item => item.type === 'article').reduce((sum, item) => sum + item.views, 0)} total views
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Videos Created</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{knowledgeContent.filter(item => item.type === 'video').length}</div>
                    <div className="text-xs text-gray-600">
                      {knowledgeContent.filter(item => item.type === 'video').reduce((sum, item) => sum + item.views, 0)} total views
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Total Reach</span>
                  <span className="font-semibold text-green-600">
                    {knowledgeContent.reduce((sum, item) => sum + item.views, 0)} people
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 7. PROFILE
  const Profile = () => {
    const expert = dashboardData?.expert || {};
    
    return (
      <div className="space-y-6">
        {/* Action Message */}
        {showActionMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Professional Profile</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{user?.name || 'Agricultural Expert'}</h3>
                    <p className="text-blue-600 font-semibold">{expert.specialization || 'Crop Science & Soil Management'}</p>
                    <p className="text-gray-600">{expert.experience || '8 years'} experience</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-800">Professional Details</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="text-blue-500">🎓</span>
                        <span>{expert.education || 'MSc Agricultural Sciences'}</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="text-green-500">📧</span>
                        <span>{user?.email || 'expert@agripay.com'}</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="text-yellow-500">💰</span>
                        <span>KES {expert.hourlyRate || '2000'}/hour</span>
                      </li>
                      {(expert.certifications || ['Certified Agronomist', 'Organic Farming Expert']).map((cert, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <span className="text-purple-500">📜</span>
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-gray-800">Service Information</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="text-red-500">📞</span>
                        <span>{user?.phone || '+254700000000'}</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="text-purple-500">🗣️</span>
                        <span>{(expert.languages || ['English', 'Swahili']).join(', ')}</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="text-indigo-500">📍</span>
                        <span>{(expert.serviceAreas || ['Central Kenya', 'Rift Valley']).join(', ')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-blue-600 font-bold text-3xl">{expert.rating || '4.8'}★</div>
                <div className="text-blue-800 font-semibold">Expert Rating</div>
                <div className="text-blue-600 text-sm mt-1">from {dashboardData?.stats?.completedConsultations || '0'} reviews</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-green-600 font-bold text-3xl">98%</div>
                <div className="text-green-800 font-semibold">Response Rate</div>
                <div className="text-green-600 text-sm mt-1">excellent</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6 text-center">
                <div className="text-yellow-600 font-bold text-3xl">{clients.length}</div>
                <div className="text-yellow-800 font-semibold">Active Clients</div>
                <div className="text-yellow-600 text-sm mt-1">satisfied customers</div>
              </div>
              <button onClick={handleEditProfile} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Edit Profile
              </button>
              <button onClick={handleLogout} className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // MAIN COMPONENT RETURN
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'E'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Expert Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome, {user?.name || 'Expert'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={handleNotificationClick} 
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
                >
                  <div className="text-xl">🔔</div>
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.slice(0, 5).map(notification => (
                        <div key={notification.id} className="p-4 border-b border-gray-100">
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleSupportClick} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Support
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: '🏠' },
                  { id: 'consultations', label: 'Consultations', icon: '📅' },
                  { id: 'knowledge', label: 'Knowledge Hub', icon: '📚' },
                  { id: 'earnings', label: 'Earnings', icon: '💰' },
                  { id: 'clients', label: 'Clients', icon: '👥' },
                  { id: 'analytics', label: 'Analytics', icon: '📊' },
                  { id: 'profile', label: 'Profile', icon: '👤' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-blue-100 text-blue-700 font-semibold' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          <div className="flex-1">
            {activeTab === 'overview' && <DashboardOverview />}
            {activeTab === 'consultations' && <ConsultationManagement />}
            {activeTab === 'knowledge' && <KnowledgeHub />}
            {activeTab === 'earnings' && <EarningsFinance />}
            {activeTab === 'clients' && <ClientManagement />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'profile' && <Profile />}
          </div>
        </div>
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

export default ExpertDashboard;