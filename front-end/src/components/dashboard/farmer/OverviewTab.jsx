import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import farmerApi from '../../../services/farmerApi';

const OverviewTab = ({ dashboardData, onDataUpdate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quickActionLoading, setQuickActionLoading] = useState('');
  const { stats, recentOrders, farmer } = dashboardData || {};

  const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
    <button type="button"
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${color} hover:shadow-md transition-shadow w-full text-left`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </button>
  );

  const handleQuickAction = async (action) => {
    setQuickActionLoading(action);
    
    try {
      switch (action) {
        case 'add-product':
          navigate('products/new');
          break;
        case 'view-orders':
          navigate('orders');
          break;
        case 'request-payout':
          // Simulate payout request
          await new Promise(resolve => setTimeout(resolve, 1000));
          alert('Payout request submitted successfully!');
          break;
        case 'contact-expert':
          navigate('expert-connect');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Quick action error:', error);
      alert('Action failed. Please try again.');
    } finally {
      setQuickActionLoading('');
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      setLoading(true);
      
      switch (action) {
        case 'accept':
          await farmerApi.updateOrderStatus(orderId, 'accepted');
          alert('Order accepted successfully!');
          break;
        case 'reject':
          await farmerApi.updateOrderStatus(orderId, 'rejected');
          alert('Order rejected successfully!');
          break;
        case 'view':
          navigate(`/farmer/orders/${orderId}`);
          return;
        default:
          break;
      }
      
      onDataUpdate(); // Refresh data
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good day, {farmer?.name}! 🌟
            </h1>
            <p className="text-gray-600 mt-2">
              Here's your farm overview for {new Date().toLocaleDateString()}
            </p>
          </div>
          <button type="button"
            onClick={() => window.location.reload()}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          color="border-blue-500"
          icon="🌱"
          subtitle="Active listings"
          onClick={() => navigate('products')}
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          color="border-yellow-500"
          icon="📦"
          subtitle="Need attention"
          onClick={() => navigate('orders?status=pending')}
        />
        <StatCard
          title="Completed Orders"
          value={stats?.completedOrders || 0}
          color="border-green-500"
          icon="✅"
          subtitle="This month"
          onClick={() => navigate('orders?status=completed')}
        />
        <StatCard
          title="Total Earnings"
          value={`₹${(stats?.totalEarnings || 0).toLocaleString()}`}
          color="border-purple-500"
          icon="💰"
          subtitle="Lifetime"
          onClick={() => navigate('financial')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <button type="button"
              onClick={() => navigate('orders')}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          
          <div className="space-y-3">
            {recentOrders?.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      order.status === 'completed' ? 'bg-green-500' : 
                      order.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()} • ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                    {order.status === 'pending' && (
                      <div className="flex space-x-1">
                        <button type="button"
                          onClick={() => handleOrderAction(order.id, 'accept')}
                          disabled={loading}
                          className="w-6 h-6 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600 disabled:opacity-50"
                          title="Accept Order"
                        >
                          ✓
                        </button>
                        <button type="button"
                          onClick={() => handleOrderAction(order.id, 'reject')}
                          disabled={loading}
                          className="w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
                          title="Reject Order"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <button type="button"
                      onClick={() => handleOrderAction(order.id, 'view')}
                      className="w-6 h-6 bg-gray-500 text-white rounded flex items-center justify-center hover:bg-gray-600"
                      title="View Details"
                    >
                      →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-gray-500">No recent orders</p>
                <p className="text-sm text-gray-400">Orders will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <button type="button"
              onClick={() => handleQuickAction('add-product')}
              disabled={quickActionLoading === 'add-product'}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-left flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">➕</span>
                <div>
                  <div className="font-medium">Add New Product</div>
                  <div className="text-sm text-green-100">List your farm products</div>
                </div>
              </div>
              {quickActionLoading === 'add-product' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>→</span>
              )}
            </button>

            <button type="button"
              onClick={() => handleQuickAction('view-orders')}
              disabled={quickActionLoading === 'view-orders'}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-left flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">📦</span>
                <div>
                  <div className="font-medium">View All Orders</div>
                  <div className="text-sm text-blue-100">Manage customer orders</div>
                </div>
              </div>
              {quickActionLoading === 'view-orders' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>→</span>
              )}
            </button>

            <button type="button"
              onClick={() => handleQuickAction('request-payout')}
              disabled={quickActionLoading === 'request-payout'}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-left flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">💰</span>
                <div>
                  <div className="font-medium">Request Payout</div>
                  <div className="text-sm text-purple-100">Withdraw your earnings</div>
                </div>
              </div>
              {quickActionLoading === 'request-payout' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>→</span>
              )}
            </button>

            <button type="button"
              onClick={() => handleQuickAction('contact-expert')}
              disabled={quickActionLoading === 'contact-expert'}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors text-left flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">👨‍🌾</span>
                <div>
                  <div className="font-medium">Contact Expert</div>
                  <div className="text-sm text-orange-100">Get farming advice</div>
                </div>
              </div>
              {quickActionLoading === 'contact-expert' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>→</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;


