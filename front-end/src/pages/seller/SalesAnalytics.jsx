// File: /src/components/seller/SalesAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, Download } from 'lucide-react';

const SalesAnalytics = ({ salesData }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    // Generate analytics data based on time range
    const generateData = () => {
      const data = [];
      const points = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 12;
      
      for (let i = 0; i < points; i++) {
        data.push({
          period: timeRange === '7d' ? `Day ${i+1}` : timeRange === '30d' ? `Week ${i+1}` : `Month ${i+1}`,
          sales: Math.floor(Math.KSHom() * 100000) + 20000,
          orders: Math.floor(Math.KSHom() * 50) + 10,
          customers: Math.floor(Math.KSHom() * 30) + 5,
          revenue: Math.floor(Math.KSHom() * 120000) + 30000
        });
      }
      return data;
    };

    setAnalyticsData(generateData());
  }, [timeRange]);

  const totalSales = analyticsData.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = analyticsData.reduce((sum, day) => sum + day.orders, 0);
  const totalCustomers = analyticsData.reduce((sum, day) => sum + day.customers, 0);
  const totalRevenue = analyticsData.reduce((sum, day) => sum + day.revenue, 0);
  const averageOrderValue = totalSales / totalOrders || 0;

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Period,Sales,Orders,Customers,Revenue\n"
      + analyticsData.map(item => 
          `${item.period},${item.sales},${item.orders},${item.customers},${item.revenue}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agripay_analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sales Analytics</h2>
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
          <button 
            onClick={handleExportData}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                KES {totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5% from last period
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalOrders}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8.3% from last period
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalCustomers}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15.2% from last period
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                KES {averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +5.7% from last period
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
        <div className="h-64">
          <div className="flex items-end justify-between h-48 space-x-2">
            {analyticsData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-green-500 rounded-t w-full transition-all hover:bg-green-600 cursor-pointer group relative"
                  style={{ 
                    height: `${(data.sales / Math.max(...analyticsData.map(d => d.sales))) * 100}%`,
                    minHeight: '20px'
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    KES {data.sales.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{data.period}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales Activity</h3>
        <div className="space-y-3">
          {analyticsData.slice(-5).map((data, index) => (
            <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-gray-900">{data.orders} orders in {data.period}</p>
                <p className="text-sm text-gray-500">{data.customers} new customers</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">KES {data.sales.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Revenue: KES {data.revenue.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
