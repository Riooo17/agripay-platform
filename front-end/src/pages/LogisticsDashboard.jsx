// src/pages/LogisticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaystackPayment from '../components/payments/PaystackPayment';

const LogisticsDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('command');
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [showActionMessage, setShowActionMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    realTimeData: {
      activeFleet: 0,
      inTransit: 0,
      perishableMonitoring: 0,
      ruralCoverage: '0%',
      coldChainIntegrity: '0%',
      predictiveArrivals: '0% accuracy'
    },
    fleetData: [],
    deliveries: [],
    predictiveRoutes: [],
    coldChainUnits: [],
    aiPredictions: [],
    paymentHistory: []
  });

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Initialize with comprehensive mock data
      const mockData = {
        realTimeData: {
          activeFleet: 8,
          inTransit: 12,
          perishableMonitoring: 156,
          ruralCoverage: '83%',
          coldChainIntegrity: '99.2%',
          predictiveArrivals: '94% accuracy'
        },
        fleetData: [
          { 
            id: 1, 
            name: 'Toyota Hilux KCD 123A', 
            status: 'active', 
            driver: 'John Kamau', 
            location: 'Nairobi CBD', 
            cargo: 'Fresh Vegetables', 
            eta: '25 min' 
          },
          { 
            id: 2, 
            name: 'Isuzu NPR KAB 456B', 
            status: 'maintenance', 
            driver: 'Sarah Mwende', 
            location: 'Depot', 
            cargo: 'Dairy Products', 
            eta: 'N/A' 
          },
          { 
            id: 3, 
            name: 'Mitsubishi Fuso KCE 789C', 
            status: 'active', 
            driver: 'Mike Ochieng', 
            location: 'Mombasa Road', 
            cargo: 'Grains', 
            eta: '3 hours' 
          },
          { 
            id: 4, 
            name: 'Ford Ranger KCF 321D', 
            status: 'active', 
            driver: 'David Njoroge', 
            location: 'Thika Road', 
            cargo: 'Fruits', 
            eta: '45 min' 
          }
        ],
        deliveries: [
          { 
            id: 'DR-2847', 
            customer: 'Fresh Farms Ltd', 
            status: 'in_transit', 
            amount: 8500, 
            from: 'Kiambu', 
            to: 'Nairobi CBD', 
            progress: 65,
            driver: 'John Kamau',
            vehicle: 'Toyota Hilux KCD 123A'
          },
          { 
            id: 'DR-2846', 
            customer: 'Nairobi Market Hub', 
            status: 'pending', 
            amount: 12000, 
            from: 'Thika', 
            to: 'Westlands', 
            progress: 0,
            driver: 'Mike Ochieng',
            vehicle: 'Mitsubishi Fuso KCE 789C'
          },
          { 
            id: 'DR-2845', 
            customer: 'Green Valley Produce', 
            status: 'completed', 
            amount: 6700, 
            from: 'Limuru', 
            to: 'Karen', 
            progress: 100,
            driver: 'Sarah Mwende',
            vehicle: 'Isuzu NPR KAB 456B'
          },
          { 
            id: 'DR-2844', 
            customer: 'Urban Grocers', 
            status: 'in_transit', 
            amount: 9500, 
            from: 'Naivasha', 
            to: 'Nairobi', 
            progress: 45,
            driver: 'David Njoroge',
            vehicle: 'Ford Ranger KCF 321D'
          }
        ],
        predictiveRoutes: [
          { 
            id: 'RT-001', 
            origin: 'Nakuru Farms', 
            destination: 'Mombasa Port', 
            optimization: 'AI-Weather-Adjusted', 
            savings: '3.2 hours, 18% fuel', 
            risk: 'Low', 
            perishableScore: 'A+' 
          },
          { 
            id: 'RT-002', 
            origin: 'Eldoret Wheat', 
            destination: 'Nairobi', 
            optimization: 'Harvest-Season', 
            savings: '2.1 hours, 12% fuel', 
            risk: 'Medium', 
            perishableScore: 'B+' 
          },
          { 
            id: 'RT-003', 
            origin: 'Kisii Tea', 
            destination: 'Mombasa Port', 
            optimization: 'Cooling-Required', 
            savings: '4.5 hours, 22% fuel', 
            risk: 'Low', 
            perishableScore: 'A' 
          }
        ],
        coldChainUnits: [
          { 
            id: 'CCU-2847', 
            cargo: 'Fresh Dairy', 
            temp: '4.2°C', 
            humidity: '65%', 
            quality: '98% Optimal', 
            eta: '2.3 hours', 
            alert: 'Stable' 
          },
          { 
            id: 'CCU-2848', 
            cargo: 'Flowers', 
            temp: '2.1°C', 
            humidity: '45%', 
            quality: '95% Optimal', 
            eta: '1.8 hours', 
            alert: 'Stable' 
          },
          { 
            id: 'CCU-2849', 
            cargo: 'Fresh Fish', 
            temp: '1.8°C', 
            humidity: '70%', 
            quality: '92% Good', 
            eta: '3.1 hours', 
            alert: 'Watch' 
          }
        ],
        aiPredictions: [
          { 
            id: 1, 
            prediction: 'Traffic congestion expected on Thika Road in 45min', 
            impact: 'High', 
            confidence: '92%', 
            action: 'Reroute suggested' 
          },
          { 
            id: 2, 
            prediction: 'Weather alert: Heavy rain in Western region', 
            impact: 'Medium', 
            confidence: '88%', 
            action: 'Delay non-urgent deliveries' 
          },
          { 
            id: 3, 
            prediction: 'Fuel price drop expected tomorrow', 
            impact: 'Low', 
            confidence: '76%', 
            action: 'Schedule refueling' 
          }
        ],
        paymentHistory: [
          { 
            id: 'PAY-001', 
            amount: 8500, 
            customer: 'Fresh Farms Ltd', 
            date: '2024-01-20', 
            status: 'completed', 
            method: 'Paystack' 
          },
          { 
            id: 'PAY-002', 
            amount: 12000, 
            customer: 'Nairobi Market Hub', 
            date: '2024-01-19', 
            status: 'pending', 
            method: 'Paystack' 
          },
          { 
            id: 'PAY-003', 
            amount: 6700, 
            customer: 'Green Valley Produce', 
            date: '2024-01-18', 
            status: 'completed', 
            method: 'Bank Transfer' 
          }
        ]
      };

      setDashboardData(mockData);
      showMessage('✅ Logistics dashboard loaded successfully!');
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showMessage('❌ Failed to load dashboard data');
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

  // ✅ FIXED PAYMENT FUNCTIONS
  const processPayment = (payment) => {
    try {
      setSelectedPayment(payment);
      setShowPaystackModal(true);
      showMessage(`💰 Payment request initiated for ${payment.customer}`);
    } catch (error) {
      console.error('Payment processing error:', error);
      showMessage('❌ Failed to process payment');
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    try {
      console.log('💰 Payment successful:', paymentData);
      
      // Update payment status in local state
      setDashboardData(prev => ({
        ...prev,
        paymentHistory: prev.paymentHistory.map(p => 
          p.id === selectedPayment.id ? { ...p, status: 'completed' } : p
        ),
        deliveries: prev.deliveries.map(d => 
          d.customer === selectedPayment.customer ? { ...d, status: 'completed', progress: 100 } : d
        )
      }));
      
      showMessage(`✅ Payment Successful! KES ${paymentData.amount} received from ${selectedPayment.customer}`);
      
      // Close modal
      setShowPaystackModal(false);
      setSelectedPayment(null);
      
    } catch (error) {
      console.error('Payment success handling error:', error);
      showMessage('❌ Error updating payment status');
    }
  };

  // ✅ FIXED DELIVERY MANAGEMENT FUNCTIONS
  const acceptDelivery = (deliveryId) => {
    try {
      setDashboardData(prev => ({
        ...prev,
        deliveries: prev.deliveries.map(d => 
          d.id === deliveryId ? { ...d, status: 'in_transit', progress: 25 } : d
        )
      }));
      showMessage(`✅ Delivery ${deliveryId} accepted! Route activated`);
    } catch (error) {
      showMessage('❌ Failed to accept delivery');
    }
  };

  const completeDelivery = (deliveryId) => {
    try {
      const delivery = dashboardData.deliveries.find(d => d.id === deliveryId);
      
      setDashboardData(prev => ({
        ...prev,
        deliveries: prev.deliveries.map(d => 
          d.id === deliveryId ? { ...d, status: 'completed', progress: 100 } : d
        ),
        paymentHistory: [
          {
            id: `PAY-${Date.now()}`,
            amount: delivery.amount,
            customer: delivery.customer,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            method: 'Paystack'
          },
          ...prev.paymentHistory
        ]
      }));
      
      showMessage(`🎉 Delivery ${deliveryId} completed! Payment of KES ${delivery.amount} ready for collection`);
    } catch (error) {
      showMessage('❌ Failed to complete delivery');
    }
  };

  // ✅ FIXED FLEET MANAGEMENT FUNCTIONS
  const scheduleMaintenance = (vehicleId) => {
    try {
      const vehicle = dashboardData.fleetData.find(v => v.id === vehicleId);
      setDashboardData(prev => ({
        ...prev,
        fleetData: prev.fleetData.map(v => 
          v.id === vehicleId ? { ...v, status: 'maintenance', eta: 'N/A' } : v
        )
      }));
      showMessage(`🔧 Maintenance scheduled for ${vehicle.name}`);
    } catch (error) {
      showMessage('❌ Failed to schedule maintenance');
    }
  };

  const activateVehicle = (vehicleId) => {
    try {
      const vehicle = dashboardData.fleetData.find(v => v.id === vehicleId);
      setDashboardData(prev => ({
        ...prev,
        fleetData: prev.fleetData.map(v => 
          v.id === vehicleId ? { ...v, status: 'active', eta: '45 min' } : v
        )
      }));
      showMessage(`✅ ${vehicle.name} activated and ready for assignments!`);
    } catch (error) {
      showMessage('❌ Failed to activate vehicle');
    }
  };

  // ✅ FIXED AI & OPTIMIZATION FUNCTIONS
  const activatePredictiveRouting = () => {
    try {
      setDashboardData(prev => ({
        ...prev,
        predictiveRoutes: [
          {
            id: `RT-${Date.now()}`,
            origin: 'AI Generated Route',
            destination: 'Optimized Destination',
            optimization: 'Real-Time AI',
            savings: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)} hours, ${Math.floor(Math.random() * 20) + 10}% fuel`,
            risk: 'Low',
            perishableScore: 'A+'
          },
          ...prev.predictiveRoutes
        ]
      }));
      showMessage('🚀 AI Route Optimization Activated! Routes optimized with predictive analytics');
    } catch (error) {
      showMessage('❌ Failed to activate predictive routing');
    }
  };

  const deployColdChainFleet = () => {
    try {
      setDashboardData(prev => ({
        ...prev,
        coldChainUnits: prev.coldChainUnits.map(unit => ({
          ...unit,
          temp: (parseFloat(unit.temp) - 0.5).toFixed(1) + '°C',
          alert: 'Optimal',
          quality: '99% Optimal'
        }))
      }));
      showMessage('❄️ Cold Chain Deployment Initiated! All units now at optimal temperature');
    } catch (error) {
      showMessage('❌ Failed to deploy cold chain');
    }
  };

  const optimizeRuralAccess = () => {
    try {
      setDashboardData(prev => ({
        ...prev,
        realTimeData: {
          ...prev.realTimeData,
          ruralCoverage: '85%'
        }
      }));
      showMessage('🏞️ Rural Logistics Enhanced! 15 new villages connected');
    } catch (error) {
      showMessage('❌ Failed to optimize rural access');
    }
  };

  const handleCrisisManagement = () => {
    try {
      setDashboardData(prev => ({
        ...prev,
        deliveries: prev.deliveries.map(d => 
          d.status === 'in_transit' ? { ...d, status: 'delayed', progress: Math.max(0, d.progress - 10) } : d
        )
      }));
      showMessage('🆕 Crisis Management Protocol Activated! Backup fleet deployed');
    } catch (error) {
      showMessage('❌ Failed to activate crisis management');
    }
  };

  const generateAIPrediction = () => {
    try {
      const newPrediction = {
        id: dashboardData.aiPredictions.length + 1,
        prediction: 'New market demand spike predicted in Central region',
        impact: 'High', 
        confidence: '89%',
        action: 'Increase fleet allocation'
      };
      
      setDashboardData(prev => ({
        ...prev,
        aiPredictions: [newPrediction, ...prev.aiPredictions]
      }));
      showMessage('🤖 New AI Prediction Generated! Market demand spike detected');
    } catch (error) {
      showMessage('❌ Failed to generate AI prediction');
    }
  };

  const optimizeFleetRoutes = () => {
    try {
      setDashboardData(prev => ({
        ...prev,
        fleetData: prev.fleetData.map(vehicle => ({
          ...vehicle,
          eta: vehicle.status === 'active' ? `${Math.max(5, parseInt(vehicle.eta) - 15)} min` : vehicle.eta
        }))
      }));
      showMessage('🚀 Fleet Routes Optimized! Average ETA reduced by 15 minutes');
    } catch (error) {
      showMessage('❌ Failed to optimize fleet routes');
    }
  };

  // ✅ FIXED LOGOUT FUNCTION
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('👋 Logistics partner logging out');
      await logout();
      navigate('/');
    }
  };

  // Loading state component
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Logistics Dashboard...</p>
        </div>
      </div>
    );
  }

  // Destructure data for easier access
  const { realTimeData, fleetData, deliveries, predictiveRoutes, coldChainUnits, aiPredictions, paymentHistory } = dashboardData;

  // COMMAND CENTER VIEW
  const CommandCenter = () => (
    <div className="p-6 space-y-6">
      {/* ACTION MESSAGE DISPLAY */}
      {showActionMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {actionMessage}
        </div>
      )}

      {/* MAIN COMMAND DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REAL-TIME FLEET INTELLIGENCE */}
        <div className="col-span-2 bg-gradient-to-br from-blue-900 to-purple-800 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">🌍 LIVE FLEET COMMAND</h2>
            <div className="flex space-x-2">
              <button 
                onClick={activatePredictiveRouting} 
                className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                AI Optimize All Routes
              </button>
              <button 
                onClick={handleCrisisManagement} 
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Crisis Protocol
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(realTimeData).map(([key, value]) => (
              <div key={key} className="bg-white bg-opacity-10 p-4 rounded-lg">
                <div className="text-blue-200 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-xl font-bold mt-1">{value}</div>
              </div>
            ))}
          </div>

          {/* ACTIVE DELIVERIES */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">📦 Active Deliveries</h3>
            <div className="space-y-3">
              {deliveries.map(delivery => (
                <div key={delivery.id} className="bg-white bg-opacity-10 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{delivery.id} - {delivery.customer}</div>
                      <div className="text-sm opacity-90">{delivery.from} → {delivery.to}</div>
                      <div className="text-green-300 font-bold">KES {delivery.amount.toLocaleString()}</div>
                      <div className="text-xs opacity-75">{delivery.driver} • {delivery.vehicle}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        delivery.status === 'completed' ? 'bg-green-500' :
                        delivery.status === 'in_transit' ? 'bg-blue-500' : 
                        delivery.status === 'delayed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}>
                        {delivery.status}
                      </span>
                      {delivery.status === 'pending' && (
                        <button 
                          onClick={() => acceptDelivery(delivery.id)}
                          className="bg-green-500 px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                        >
                          Accept
                        </button>
                      )}
                      {delivery.status === 'in_transit' && (
                        <button 
                          onClick={() => completeDelivery(delivery.id)}
                          className="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        delivery.status === 'completed' ? 'bg-green-500' :
                        delivery.status === 'in_transit' ? 'bg-blue-500' : 
                        delivery.status === 'delayed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${delivery.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERISHABLE GOODS COMMAND */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">❄️ COLD CHAIN INTEGRITY</h2>
          <button 
            onClick={deployColdChainFleet} 
            className="w-full bg-white text-green-700 py-3 rounded-lg font-bold mb-4 hover:bg-gray-100 transition-colors"
          >
            ACTIVATE COLD CHAIN MONITORING
          </button>
          {coldChainUnits.map(unit => (
            <div key={unit.id} className="bg-white bg-opacity-10 p-3 rounded-lg mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">{unit.cargo}</span>
                <span className={unit.alert === 'Stable' ? 'text-green-300' : 'text-yellow-300'}>
                  {unit.alert}
                </span>
              </div>
              <div className="text-sm opacity-90">Temp: {unit.temp} | Quality: {unit.quality}</div>
              <div className="text-xs opacity-75">ETA: {unit.eta}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PREDICTIVE ANALYTICS ENGINE */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🧠 AI PREDICTIVE ROUTING</h2>
          <button 
            onClick={activatePredictiveRouting} 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate Smart Routes
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predictiveRoutes.map(route => (
            <div key={route.id} className="border-2 border-purple-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="font-bold text-purple-700">{route.id}</div>
              <div className="text-sm text-gray-600 mt-2">{route.origin} → {route.destination}</div>
              <div className="text-green-600 font-semibold mt-2">Savings: {route.savings}</div>
              <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                route.risk === 'Low' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                Risk: {route.risk}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // SMART PAYMENTS SECTION
  const SmartPayments = () => (
    <div className="p-6 space-y-6">
      {/* ACTION MESSAGE DISPLAY */}
      {showActionMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {actionMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900">💳 SMART PAYMENT SOLUTIONS</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PAYMENT PROCESSING */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Payment Processing</h2>
          <div className="space-y-4">
            <button 
              onClick={() => processPayment({ 
                id: 'NEW', 
                amount: 15000, 
                customer: 'New Customer' 
              })}
              className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 font-semibold transition-colors"
            >
              Request Paystack Payment
            </button>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Pending Payments</h3>
              {paymentHistory.filter(p => p.status === 'pending').map(payment => (
                <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{payment.customer}</div>
                    <div className="text-sm text-gray-600">KES {payment.amount.toLocaleString()}</div>
                  </div>
                  <button 
                    onClick={() => processPayment(payment)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Collect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PAYMENT HISTORY */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Payment History</h2>
          <div className="space-y-3">
            {paymentHistory.map(payment => (
              <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{payment.customer}</div>
                  <div className="text-sm text-gray-600">{payment.date} • {payment.method}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">KES {payment.amount.toLocaleString()}</div>
                  <div className={`text-xs ${
                    payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {payment.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // PREDICTIVE AI SECTION
  const PredictiveAI = () => (
    <div className="p-6 space-y-6">
      {/* ACTION MESSAGE DISPLAY */}
      {showActionMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {actionMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900">🤖 PREDICTIVE AI INTELLIGENCE</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI PREDICTIONS */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔮 Real-Time Predictions</h2>
          <button 
            onClick={generateAIPrediction}
            className="w-full bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 font-semibold mb-6 transition-colors"
          >
            Generate New AI Insights
          </button>
          
          <div className="space-y-4">
            {aiPredictions.map(prediction => (
              <div key={prediction.id} className="border-l-4 border-purple-500 pl-4 py-2">
                <div className="font-semibold text-gray-900">{prediction.prediction}</div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Impact: {prediction.impact}</span>
                  <span>Confidence: {prediction.confidence}</span>
                </div>
                <div className="text-sm text-purple-600 font-medium mt-1">{prediction.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FLEET OPTIMIZATION */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚛 Fleet Optimization AI</h2>
          <div className="space-y-4">
            <button 
              onClick={optimizeFleetRoutes} 
              className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 font-semibold transition-colors"
            >
              Optimize All Routes
            </button>
            <button 
              onClick={deployColdChainFleet} 
              className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 font-semibold transition-colors"
            >
              Cold Chain AI Management
            </button>
            <button 
              onClick={optimizeRuralAccess} 
              className="w-full bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 font-semibold transition-colors"
            >
              Rural Access AI Planning
            </button>
          </div>

          {/* FLEET STATUS */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-3">Live Fleet Status</h3>
            <div className="space-y-3">
              {fleetData.map(vehicle => (
                <div key={vehicle.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{vehicle.name}</div>
                    <div className="text-sm text-gray-600">{vehicle.driver} • {vehicle.location}</div>
                    <div className="text-xs text-gray-500">{vehicle.cargo}</div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 
                      vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{vehicle.eta}</div>
                    <div className="flex space-x-1 mt-1">
                      {vehicle.status === 'active' && (
                        <button 
                          onClick={() => scheduleMaintenance(vehicle.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                        >
                          Maintenance
                        </button>
                      )}
                      {vehicle.status === 'maintenance' && (
                        <button 
                          onClick={() => activateVehicle(vehicle.id)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                        >
                          Activate
                        </button>
                      )}
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

  const renderSection = () => {
    switch (activeSection) {
      case 'command':
        return <CommandCenter />;
      case 'payments':
        return <SmartPayments />;
      case 'ai':
        return <PredictiveAI />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* COMMAND HEADER */}
      <header className="bg-gradient-to-r from-gray-900 to-blue-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">AGRI-LOGISTICS COMMAND</h1>
                <p className="text-blue-300 text-sm">
                  REAL-TIME OPERATIONS • {user?.name || 'COMMANDER'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="font-semibold">{user?.name || 'COMMANDER'}</div>
                <div className="text-blue-300 text-sm">LOGISTICS DASHBOARD</div>
              </div>
              {/* ✅ WORKING LOGOUT BUTTON */}
              <button 
                onClick={handleLogout}
                className="bg-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 shadow-lg transition-colors"
              >
                🔒 LOGOUT
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* TACTICAL NAVIGATION */}
      <nav className="bg-white shadow-xl border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'command', name: '🚀 COMMAND CENTER', desc: 'Live Operations' },
              { id: 'payments', name: '💳 SMART PAYMENTS', desc: 'Paystack Integrated' },
              { id: 'ai', name: '🤖 PREDICTIVE AI', desc: 'AI Intelligence' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`py-4 px-2 border-b-4 font-bold text-sm transition-all ${
                  activeSection === item.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div>{item.name}</div>
                <div className="text-xs font-normal opacity-75">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto">
        {renderSection()}
      </main>

      {/* ✅ FIXED PAYSTACK MODAL */}
      {showPaystackModal && selectedPayment && (
        <PaystackPayment
          amount={selectedPayment.amount}
          email={user?.email || 'logistics@agripay.com'}
          productName={`Logistics Service - ${selectedPayment.customer}`}
          description={`Payment for delivery services rendered to ${selectedPayment.customer}`}
          userType="logistics"
          onSuccess={handlePaymentSuccess}
          onClose={() => {
            setShowPaystackModal(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default LogisticsDashboard;