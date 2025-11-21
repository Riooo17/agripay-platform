// src/components/logistics/DashboardLayout.jsx (Complete version)
import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  DollarSign, 
  BarChart3, 
  Bell, 
  Users,
  Settings,
  Menu,
  X,
  Home,
  Package,
  Navigation,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';

const DashboardLayout = ({ children, activeSection, onSectionChange, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: 'new_job',
        title: 'New Delivery Available',
        message: 'Fresh produce delivery to Nairobi Market',
        time: '2 min ago',
        unread: true,
        priority: 'high'
      },
      {
        id: 2,
        type: 'payment',
        title: 'Payment Received',
        message: 'KES 15,200 for Delivery #DR-2847',
        time: '1 hour ago',
        unread: true,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'alert',
        title: 'Route Change',
        message: 'Alternative route suggested due to traffic',
        time: '3 hours ago',
        unread: true,
        priority: 'medium'
      }
    ]);
  }, []);

  const navigationItems = [
    { id: 'overview', name: 'Dashboard Overview', icon: Home, badge: '3', color: 'text-blue-600' },
    { id: 'fleet', name: 'Fleet Management', icon: Truck, badge: '', color: 'text-green-600' },
    { id: 'deliveries', name: 'Delivery Operations', icon: Package, badge: '5', color: 'text-orange-600' },
    { id: 'payments', name: 'Payments & Finance', icon: DollarSign, badge: '2', color: 'text-emerald-600' },
    { id: 'analytics', name: 'Performance Analytics', icon: BarChart3, badge: '', color: 'text-purple-600' },
    { id: 'tracking', name: 'Live Tracking', icon: Navigation, badge: 'Live', color: 'text-red-600' },
    { id: 'customers', name: 'Customer Hub', icon: Users, badge: '', color: 'text-cyan-600' },
    { id: 'notifications', name: 'Smart Alerts', icon: Bell, badge: unreadCount.toString(), color: 'text-yellow-600' },
  ];

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
    setUnreadCount(0);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all duration-300 flex flex-col`}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-yellow-500 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Logi<span className="text-green-600">Afrika</span></span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                  activeSection === item.id
                    ? 'bg-green-50 border border-green-200 text-green-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${item.color} flex-shrink-0`} />
                {sidebarOpen && (
                  <>
                    <span className="ml-3 font-medium">{item.name}</span>
                    {item.badge && (
                      <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                        activeSection === item.id 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Driver User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role || 'Logistics Partner'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeSection.replace(/([A-Z])/g, ' $1')}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeSection === 'overview' && 'Monitor your logistics operations in real-time'}
                  {activeSection === 'fleet' && 'Manage your vehicles and drivers efficiently'}
                  {activeSection === 'deliveries' && 'Track and manage all delivery operations'}
                  {activeSection === 'payments' && 'View earnings and process payments'}
                  {activeSection === 'analytics' && 'Analyze performance and optimize routes'}
                  {activeSection === 'tracking' && 'Live vehicle tracking and route optimization'}
                  {activeSection === 'customers' && 'Manage customer relationships and feedback'}
                  {activeSection === 'notifications' && 'Stay updated with smart alerts'}
                </p>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button 
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => onSectionChange('notifications')}
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;