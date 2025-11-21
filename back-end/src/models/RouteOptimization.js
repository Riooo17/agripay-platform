// models/RouteOptimization.js
const mongoose = require('mongoose');

const routeOptimizationSchema = new mongoose.Schema({
  // Route identification
  routeId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // Route details
  origin: {
    address: String,
    county: String,
    coordinates: { lat: Number, lng: Number }
  },
  destination: {
    address: String,
    county: String,
    coordinates: { lat: Number, lng: Number }
  },
  waypoints: [{
    address: String,
    coordinates: { lat: Number, lng: Number },
    stopType: { type: String, enum: ['pickup', 'delivery', 'fuel', 'rest'] }
  }],
  
  // Optimization parameters
  optimizationType: {
    type: String,
    enum: ['fastest', 'shortest', 'eco_friendly', 'avoid_tolls', 'rural_access'],
    default: 'fastest'
  },
  constraints: {
    maxStops: Number,
    maxDistance: Number,
    timeWindows: [{
      location: String,
      earliest: Date,
      latest: Date
    }],
    vehicleType: String
  },
  
  // AI predictions and analytics
  predictions: {
    trafficConditions: {
      level: { type: String, enum: ['low', 'medium', 'high', 'severe'] },
      expectedDelay: Number, // minutes
      confidence: Number // 0-100
    },
    weatherImpact: {
      condition: String,
      impactLevel: { type: String, enum: ['none', 'low', 'medium', 'high'] },
      recommendations: [String]
    },
    fuelOptimization: {
      estimatedFuel: Number,
      savings: Number,
      optimalSpeed: Number
    }
  },
  
  // Route metrics
  metrics: {
    totalDistance: Number, // km
    estimatedDuration: Number, // minutes
    actualDuration: Number, // minutes
    fuelCost: Number,
    tollCost: Number,
    co2Emission: Number // kg
  },
  
  // Performance
  performance: {
    accuracy: Number, // 0-100
    reliability: Number, // 0-100
    userSatisfaction: Number // 0-5
  },
  
  // Status
  status: {
    type: String,
    enum: ['generated', 'active', 'completed', 'cancelled', 'optimized'],
    default: 'generated'
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('RouteOptimization', routeOptimizationSchema);