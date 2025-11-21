import React from 'react';

const TabNavigation = ({ activeTab, onTabChange, stats }) => {
  const tabs = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: '📊',
      description: 'Dashboard overview',
      badge: null
    },
    { 
      id: 'products', 
      name: 'Products', 
      icon: '🌱',
      description: 'Manage your products',
      badge: stats?.totalProducts || 0
    },
    { 
      id: 'orders', 
      name: 'Orders', 
      icon: '📦',
      description: 'Customer orders',
      badge: stats?.pendingOrders || 0
    },
    { 
      id: 'profile', 
      name: 'Farm Profile', 
      icon: '🏠',
      description: 'Farm information',
      badge: null
    },
    { 
      id: 'financial', 
      name: 'Financial', 
      icon: '💰',
      description: 'Earnings & payments',
      badge: null
    },
    { 
      id: 'expert', 
      name: 'Expert Connect', 
      icon: '👨‍🌾',
      description: 'Get expert advice',
      badge: null
    },
    { 
      id: 'community', 
      name: 'Community', 
      icon: '👥',
      description: 'Connect with farmers',
      badge: null
    },
  ];

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{tab.name}</span>
                  {tab.badge !== null && tab.badge > 0 && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      tab.id === 'orders' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{tab.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;