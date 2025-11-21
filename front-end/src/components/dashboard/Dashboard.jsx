import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">🌱 AgriPay</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-green-200 transition">Dashboard</a>
                <a href="#" className="hover:text-green-200 transition">Marketplace</a>
                <a href="#" className="hover:text-green-200 transition">Analytics</a>
                <a href="#" className="hover:text-green-200 transition">Community</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span>Welcome, {user.name || user.email}</span>
                  <button 
                    onClick={logout}
                    className="bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-x-2">
                  <button className="bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition">
                    Login
                  </button>
                  <button className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-100 transition">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Cards */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">🎯 Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-green-50 rounded hover:bg-green-100 transition">
                  List Products
                </button>
                <button className="w-full text-left p-3 bg-blue-50 rounded hover:bg-blue-100 transition">
                  Browse Marketplace
                </button>
                <button className="w-full text-left p-3 bg-yellow-50 rounded hover:bg-yellow-100 transition">
                  Find Experts
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">📊 Recent Activity</h3>
              <p className="text-gray-600">No recent activity</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">🗺️ AgriPay Map</h3>
              <p className="text-gray-600">Map integration coming soon</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to AgriPay
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The future of African agriculture. Connect farmers, buyers, experts, 
              and service providers in one unified platform.
            </p>
            <div className="space-x-4">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition text-lg">
                Join as Farmer
              </button>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg">
                Join as Buyer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;