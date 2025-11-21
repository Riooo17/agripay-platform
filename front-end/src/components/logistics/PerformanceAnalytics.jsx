// src/components/logistics/PerformanceAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award, 
  Clock,
  CheckCircle2,
  DollarSign,
  Users,
  Download,
  Filter,
  Calendar
} from 'lucide-react';

const PerformanceAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [metrics, setMetrics] = useState({
    deliverySuccess: 0,
    onTimeRate: 0,
    customerSatisfaction: 0,
    revenueGrowth: 0,
    fleetUtilization: 0,
    costPerDelivery: 0
  });

  const [kpis, setKpis] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    // Mock analytics data
    setMetrics({
      deliverySuccess: 98.2,
      onTimeRate: 94.5,
      customerSatisfaction: 96.8,
      revenueGrowth: 12.3,
      fleetUtilization: 85.7,
      costPerDelivery: 1250
    });

    setKpis([
      { name: 'Delivery Success Rate', current: 98.2, target: 95, trend: 'up' },
      { name: 'On-Time Performance', current: 94.5, target: 92, trend: 'up' },
      { name: 'Customer Satisfaction', current: 96.8, target: 90, trend: 'up' },
      { name: 'Revenue per Delivery', current: 8900, target: 8500, trend: 'up' },
      { name: 'Fuel Efficiency', current: 8.2, target: 8.5, trend: 'down' },
      { name: 'Driver Retention', current: 88.5, target: 85, trend: 'up' }
    ]);

    setTrends([
      { month: 'Jan', deliveries: 45, revenue: 385000, satisfaction: 94.2 },
      { month: 'Feb', deliveries: 52, revenue: 445000, satisfaction: 95.1 },
      { month: 'Mar', deliveries: 48, revenue: 412000, satisfaction: 95.8 },
      { month: 'Apr', deliveries: 61, revenue: 528000, satisfaction: 96.3 },
      { month: 'May', deliveries: 57, revenue: 495000, satisfaction: 96.8 },
      { month: 'Jun', deliveries: 64, revenue: 562000, satisfaction: 97.1 }
    ]);
  }, []);

  const MetricCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}%</p>
          <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last period
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and business intelligence</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Delivery Success Rate"
          value={metrics.deliverySuccess}
          change={+2.1}
          icon={CheckCircle2}
          color="bg-green-500"
        />
        <MetricCard
          title="On-Time Performance"
          value={metrics.onTimeRate}
          change={+1.8}
          icon={Clock}
          color="bg-blue-500"
        />
        <MetricCard
          title="Customer Satisfaction"
          value={metrics.customerSatisfaction}
          change={+3.2}
          icon={Award}
          color="bg-purple-500"
        />
        <MetricCard
          title="Revenue Growth"
          value={metrics.revenueGrowth}
          change={+12.3}
          icon={TrendingUp}
          color="bg-emerald-500"
        />
        <MetricCard
          title="Fleet Utilization"
          value={metrics.fleetUtilization}
          change={+5.7}
          icon={Users}
          color="bg-orange-500"
        />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Cost per Delivery</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">KES {metrics.costPerDelivery.toLocaleString()}</p>
              <p className="text-sm text-red-600 mt-1">↓ 2.3% from last period</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPI Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">KPI Performance vs Targets</h2>
          <div className="space-y-4">
            {kpis.map((kpi, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{kpi.name}</span>
                  <span className="font-bold text-gray-900">
                    {typeof kpi.current === 'number' && kpi.current > 1000 
                      ? `KES ${kpi.current.toLocaleString()}` 
                      : `${kpi.current}%`}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        kpi.current >= kpi.target ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min(100, (kpi.current / kpi.target) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <Target className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">{kpi.target}%</span>
                    <span className={`${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.trend === 'up' ? '↑' : '↓'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trends Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h2>
          <div className="space-y-4">
            {trends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{trend.month}</p>
                    <p className="text-sm text-gray-600">{trend.deliveries} deliveries</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">KES {trend.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">{trend.satisfaction}% satisfaction</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Optimization Opportunity</h3>
            </div>
            <p className="text-sm text-green-700">
              Route optimization could save 15% on fuel costs for Nairobi-Thika corridor.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Driver Performance</h3>
            </div>
            <p className="text-sm text-blue-700">
              Top 3 drivers maintain 99% on-time rate. Consider incentive program.
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Revenue Growth</h3>
            </div>
            <p className="text-sm text-purple-700">
              Cold-chain deliveries show 25% higher margins. Expand this service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;