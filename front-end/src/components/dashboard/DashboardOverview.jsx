// src/components/dashboard/DashboardOverview.jsx
import React from 'react';

const DashboardOverview = ({ dashboardData, onNavigate, onDataUpdate }) => {
  const overview = dashboardData?.overview || {};
  const recommendedProducts = dashboardData?.recommendedProducts || [];
  const recentOrders = dashboardData?.recentOrders || [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl text-white">👋</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">Here's what's happening with your farm purchases today</p>
          </div>
        </div>
      </div>

      {/* Quick Stats - Clean Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">{overview.activeOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">KSh {(overview.totalSpent || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🏪</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Trusted Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{overview.favoriteSuppliersCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Cart Items</p>
              <p className="text-2xl font-bold text-gray-900">{overview.cartItems || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products - Clean List */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
          <p className="text-gray-600 text-sm">Products you might like</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {recommendedProducts.map((product) => (
            <div key={product._id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌽</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {product.qualityGrade}
                    </span>
                    {product.isOrganic && (
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                        Organic
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-500 text-xs mt-2">
                    From {product.farmer?.farmerProfile?.farmName || product.farmer?.profile?.businessName}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">KSh {product.price}</p>
                  <p className="text-gray-600 text-sm">per {product.unit}</p>
                  <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders - Clean List */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <p className="text-gray-600 text-sm">Your order history</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl">📦</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.productName || 'Agricultural Product'}</h3>
                      <p className="text-gray-600 text-sm">Order #{order.orderId || order._id}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">KSh {order.amount?.toLocaleString()}</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🛒</div>
              <h3 className="font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Start shopping to see your order history here</p>
              <button 
                onClick={() => onNavigate('discovery')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700"
              >
                Browse Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions - Clean Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('discovery')}
            className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left"
          >
            <div className="text-2xl mb-2">🔍</div>
            <p className="font-medium text-gray-900">Browse Products</p>
            <p className="text-gray-600 text-sm">Find quality farm products</p>
          </button>
          
          <button 
            onClick={() => onNavigate('orders')}
            className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left"
          >
            <div className="text-2xl mb-2">📦</div>
            <p className="font-medium text-gray-900">My Orders</p>
            <p className="text-gray-600 text-sm">Track your purchases</p>
          </button>
          
          <button 
            onClick={() => onNavigate('payments')}
            className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left"
          >
            <div className="text-2xl mb-2">💳</div>
            <p className="font-medium text-gray-900">Payments</p>
            <p className="text-gray-600 text-sm">Manage transactions</p>
          </button>
          
          <button 
            onClick={() => onNavigate('suppliers')}
            className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left"
          >
            <div className="text-2xl mb-2">🤝</div>
            <p className="font-medium text-gray-900">Suppliers</p>
            <p className="text-gray-600 text-sm">Connect with farmers</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;