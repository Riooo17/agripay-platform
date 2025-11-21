// src/components/logistics/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  DollarSign,
  Users,
  MapPin,
  Zap,
  Shield,
  Star
} from 'lucide-react';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    completedToday: 0,
    totalEarnings: 0,
    onTimeRate: 0,
    customerRating: 0,
    fleetOnline: 0
  });

  const [quickActions, setQuickActions] = useState([
    {
      id: 1,
      title: 'Accept New Delivery',
      description: 'View available delivery jobs',
      icon: Package,
      color: 'bg-green-500',
      action: () => alert('Opening available deliveries...'),
      enabled: true
    },
    {
      id: 2,
      title: 'Start Route',
      description: 'Begin your scheduled route',
      icon: MapPin,
      color: 'bg-blue-500',
      action: () => alert('Starting route navigation...'),
      enabled: true
    },
    {
      id: 3,
      title: 'Process Payment',
      description: 'Send/receive M-Pesa payments',
      icon: DollarSign,
      color: 'bg-emerald-500',
      action: () => alert('Opening payment processor...'),
      enabled: true
    },
    {
      id: 4,
      title: 'Report Issue',
      description: 'Log delivery challenges',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      action: () => alert('Opening issue reporting...'),
      enabled: true
    }
  ]);

  const [recentActivities, setRecentActivities] = useState([]);

  // Simulate data loading
  useEffect(() => {
    // Mock stats data
    setStats({
      activeDeliveries: 3,
      completedToday: 12,
      totalEarnings: 45200,
      onTimeRate: 94,
      customerRating: 4.8,
      fleetOnline: 8
    });

    // Mock recent activities
    setRecentActivities([
      {
        id: 1,
        type: 'delivery_completed',
        message: 'Delivery #DR-2847 completed successfully',
        time: '10 minutes ago',
        icon: CheckCircle2,
        color: 'text-green-500'
      },
      {
        id: 2,
        type: 'payment_received',
        message: 'KES 8,500 received for Delivery #DR-2846',
        time: '1 hour ago',
        icon: DollarSign,
        color: 'text-emerald-500'
      },
      {
        id: 3,
        type: 'new_rating',
        message: 'New 5-star rating from Farm Fresh Ltd.',
        time: '2 hours ago',
        icon: Star,
        color: 'text-yellow-500'
      },
      {
        id: 4,
        type: 'route_optimized',
        message: 'Route optimized saving 15 minutes',
        time: '3 hours ago',
        icon: Zap,
        color: 'text-blue-500'
      }
    ]);
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from yesterday
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-yellow-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, David! 🚚</h1>
            <p className="text-green-100 mt-2">
              Ready to optimize today's deliveries? You have {stats.activeDeliveries} active deliveries.
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <div>
                <p className="font-semibold">Premium Partner</p>
                <p className="text-green-100 text-sm">Elite Performance Tier</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Active Deliveries"
          value={stats.activeDeliveries}
          change={+15}
          icon={Package}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed Today"
          value={stats.completedToday}
          change={+8}
          icon={CheckCircle2}
          color="bg-green-500"
        />
        <StatCard
          title="Today's Earnings"
          value={`KES ${stats.totalEarnings.toLocaleString()}`}
          change={+12}
          icon={DollarSign}
          color="bg-emerald-500"
        />
        <StatCard
          title="On-Time Rate"
          value={`${stats.onTimeRate}%`}
          change={+2}
          icon={Clock}
          color="bg-purple-500"
        />
        <StatCard
          title="Customer Rating"
          value={stats.customerRating}
          change={+0.2}
          icon={Star}
          color="bg-yellow-500"
        />
        <StatCard
          title="Fleet Online"
          value={`${stats.fleetOnline}/12`}
          change={-1}
          icon={Users}
          color="bg-cyan-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              disabled={!action.enabled}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-left hover:shadow-md transition-all transform hover:-translate-y-1 ${
                !action.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-green-600 font-medium hover:text-green-700">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${activity.color} bg-opacity-10 mt-1`}>
                    <Icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
          <div className="space-y-4">
            {[
              { label: 'Delivery Success Rate', value: 98, target: 95 },
              { label: 'Customer Satisfaction', value: 96, target: 90 },
              { label: 'On-Time Performance', value: 94, target: 92 },
              { label: 'Vehicle Utilization', value: 85, target: 80 }
            ].map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{metric.label}</span>
                  <span className="font-medium text-gray-900">{metric.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metric.value >= metric.target ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Target: {metric.target}%</span>
                  <span>
                    {metric.value >= metric.target ? '🎯 Target Met' : '📈 Needs Improvement'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;