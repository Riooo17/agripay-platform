// src/components/dashboard/RealTimePriceTracker.jsx - Live Market Prices
import React, { useState, useEffect } from 'react';

const RealTimePriceTracker = () => {
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [marketPrices, setMarketPrices] = useState({});

  // Simulated real-time price updates
  useEffect(() => {
    const products = ['maize', 'beans', 'tomatoes', 'avocados'];
    const initialPrices = {
      maize: { current: 45, change: 0.08, trend: 'up' },
      beans: { current: 95, change: -0.05, trend: 'down' },
      tomatoes: { current: 120, change: 0.12, trend: 'up' },
      avocados: { current: 80, change: -0.02, trend: 'down' }
    };
    setMarketPrices(initialPrices);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMarketPrices(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          const change = (Math.KSHom() - 0.5) * 0.1;
          updated[key] = {
            current: Math.max(updated[key].current * (1 + change), 10),
            change: change,
            trend: change >= 0 ? 'up' : 'down'
          };
        });
        return updated;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const createPriceAlert = (product, targetPrice) => {
    setPriceAlerts(prev => [...prev, {
      id: Date.now(),
      product,
      targetPrice,
      currentPrice: marketPrices[product]?.current,
      active: true
    }]);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-800">📈 Live Market Prices</h2>
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
          Live
        </span>
      </div>

      <div className="space-y-4">
        {Object.entries(marketPrices).map(([product, data]) => (
          <div key={product} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                data.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <div>
                <p className="font-semibold text-green-900 capitalize">{product}</p>
                <p className="text-green-600 text-sm">Per kg</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-800">
                KSh {data.current.toFixed(2)}
              </p>
              <p className={`text-sm ${
                data.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.trend === 'up' ? '↗' : '↘'} {(data.change * 100).toFixed(1)}%
              </p>
            </div>
            <button
              onClick={() => createPriceAlert(product, data.current * 0.9)}
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
            >
              Set Alert
            </button>
          </div>
        ))}
      </div>

      {/* Price Alerts */}
      {priceAlerts.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-green-800 mb-3">💰 Your Price Alerts</h3>
          <div className="space-y-2">
            {priceAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-800 capitalize">{alert.product}</p>
                  <p className="text-yellow-600 text-sm">Alert at KSh {alert.targetPrice}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-sm">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimePriceTracker;
