// src/components/dashboard/AIProductRecommendations.jsx - Smart AI Suggestions
import React, { useState, useEffect } from 'react';

const AIProductRecommendations = ({ userPreferences, purchaseHistory }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI-powered recommendation engine
  useEffect(() => {
    // Simulate AI processing
    const aiRecommendedProducts = [
      {
        id: 101,
        name: 'Organic Fertilizer',
        category: 'Farm Inputs',
        reason: 'Based on your maize purchases',
        confidence: 0.92,
        price: 1200,
        supplier: 'AgroTech Solutions',
        rating: 4.7
      },
      {
        id: 102,
        name: 'Drip Irrigation Kit',
        category: 'Irrigation',
        reason: 'Popular in your region',
        confidence: 0.87,
        price: 8500,
        supplier: 'WaterSmart Africa',
        rating: 4.5
      },
      {
        id: 103,
        name: 'Premium Seeds Pack',
        category: 'Seeds',
        reason: 'Seasonal bestseller',
        confidence: 0.78,
        price: 450,
        supplier: 'Seed Masters',
        rating: 4.8
      }
    ];

    setRecommendations(aiRecommendedProducts);
    setLoading(false);
  }, [userPreferences, purchaseHistory]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
        <div className="animate-pulse">
          <div className="h-6 bg-green-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-3">
                <div className="w-16 h-16 bg-green-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-green-200 rounded"></div>
                  <div className="h-3 bg-green-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2">🤖 AI Recommendations</h2>
          <p className="opacity-90">Smart suggestions just for you</p>
        </div>
        <div className="text-3xl">⚡</div>
      </div>

      <div className="space-y-4">
        {recommendations.map(product => (
          <div key={product.id} className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{product.name}</h3>
              <span className="bg-white bg-opacity-30 px-2 py-1 rounded-full text-xs">
                {Math.round(product.confidence * 100)}% match
              </span>
            </div>
            <p className="text-white text-opacity-80 text-sm mb-3">{product.reason}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">KSh {product.price}</p>
                <p className="text-white text-opacity-70 text-sm">{product.supplier}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-white bg-opacity-30 px-2 py-1 rounded">
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="ml-1 text-yellow-300">⭐</span>
                </div>
                <button className="bg-white text-green-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-50">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIProductRecommendations;