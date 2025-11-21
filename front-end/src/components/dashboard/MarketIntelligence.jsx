// src/components/dashboard/MarketIntelligence.jsx
import React, { useState, useEffect } from 'react';
import { buyerService } from '../../services/buyerService';

const MarketIntelligence = () => {
  const [marketData, setMarketData] = useState({
    priceTrends: [],
    regionalInsights: [],
    marketAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('weekly');

  // Load real market data from backend
  useEffect(() => {
    const loadMarketData = async () => {
      setLoading(true);
      console.log('🔄 Loading real market intelligence data...');
      
      try {
        const dashboardData = await buyerService.getDashboardData();
        
        if (dashboardData && dashboardData.marketInsights) {
          setMarketData(dashboardData.marketInsights);
          console.log('✅ Market data loaded successfully');
        } else {
          // Fallback mock data
          const mockMarketData = {
            priceTrends: [
              { product: 'Maize', current: 45, change: -0.08, trend: 'down', unit: 'kg' },
              { product: 'Tomatoes', current: 120, change: 0.12, trend: 'up', unit: 'kg' },
              { product: 'Beans', current: 95, change: -0.05, trend: 'down', unit: 'kg' },
              { product: 'Avocados', current: 80, change: 0.03, trend: 'up', unit: 'kg' }
            ],
            regionalInsights: [
              { 
                region: 'Rift Valley', 
                product: 'Maize', 
                supply: 'High', 
                demand: 'High',
                averagePrice: 42,
                priceTrend: 'stable'
              },
              { 
                region: 'Coastal', 
                product: 'Tomatoes', 
                supply: 'Medium', 
                demand: 'High',
                averagePrice: 125,
                priceTrend: 'rising'
              }
            ],
            marketAlerts: [
              {
                id: 1,
                type: 'price_drop',
                product: 'Maize',
                region: 'Rift Valley',
                message: 'Maize prices dropped 8% in Rift Valley',
                severity: 'medium',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
              }
            ]
          };
          setMarketData(mockMarketData);
        }
      } catch (error) {
        console.error('❌ Failed to load market data:', error);
        setMarketData({
          priceTrends: [],
          regionalInsights: [],
          marketAlerts: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
  }, [timeRange]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getSupplyColor = (supply) => {
    switch (supply) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <h1 className="text-2xl font-bold text-green-800 mb-2">📈 Market Intelligence</h1>
          <p className="text-green-600">Loading real-time market insights...</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-green-800 font-semibold">Analyzing market trends...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">📈 Market Intelligence</h1>
            <p className="text-green-600">Real-time market insights and price trends</p>
          </div>
          <div className="mt-4 md:mt-0">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="daily">Last 24 Hours</option>
              <option value="weekly">Last Week</option>
              <option value="monthly">Last Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Alerts */}
      {marketData.marketAlerts && marketData.marketAlerts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <h2 className="text-lg font-semibold text-green-800 mb-4">🚨 Market Alerts</h2>
          <div className="space-y-3">
            {marketData.marketAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-green-900">{alert.product}</span>
                      <span className="text-green-600 text-sm">• {alert.region}</span>
                    </div>
                    <p className="text-green-700 text-sm">{alert.message}</p>
                    <p className="text-green-500 text-xs mt-2">{formatTimeAgo(alert.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trends */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <h2 className="text-lg font-semibold text-green-800 mb-4">💰 Price Trends</h2>
          <div className="space-y-3">
            {marketData.priceTrends.length > 0 ? (
              marketData.priceTrends.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.trend === 'up' ? 'bg-green-500' : 
                      item.trend === 'down' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-semibold text-green-900">{item.product}</p>
                      <p className="text-green-600 text-sm">Per {item.unit || 'kg'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-800">KSh {item.current}</p>
                    <p className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)} {Math.abs(item.change * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-green-600">
                <div className="text-4xl mb-2">📊</div>
                <p>No price data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Regional Insights */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <h2 className="text-lg font-semibold text-green-800 mb-4">🌍 Regional Insights</h2>
          <div className="space-y-4">
            {marketData.regionalInsights.length > 0 ? (
              marketData.regionalInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-900">{insight.region}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {insight.product}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">Supply:</span>
                      <span className={`ml-2 font-semibold ${getSupplyColor(insight.supply)}`}>
                        {insight.supply}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">Demand:</span>
                      <span className={`ml-2 font-semibold ${getDemandColor(insight.demand)}`}>
                        {insight.demand}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-green-600">
                <div className="text-4xl mb-2">🌍</div>
                <p>No regional insights available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Market Summary */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">📊 Market Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg">
            <div className="text-2xl mb-2">📈</div>
            <p className="font-semibold">Rising Prices</p>
            <p className="text-sm opacity-90 mt-1">
              {marketData.priceTrends.filter(item => item.trend === 'up').length} products
            </p>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg">
            <div className="text-2xl mb-2">📉</div>
            <p className="font-semibold">Falling Prices</p>
            <p className="text-sm opacity-90 mt-1">
              {marketData.priceTrends.filter(item => item.trend === 'down').length} products
            </p>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg">
            <div className="text-2xl mb-2">🌍</div>
            <p className="font-semibold">Regions</p>
            <p className="text-sm opacity-90 mt-1">
              {marketData.regionalInsights.length} regions
            </p>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg">
            <div className="text-2xl mb-2">🚨</div>
            <p className="font-semibold">Alerts</p>
            <p className="text-sm opacity-90 mt-1">
              {marketData.marketAlerts?.length || 0} alerts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;