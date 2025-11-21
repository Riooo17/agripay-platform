const mongoose = require('mongoose');

const marketInsightSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  lastWeekPrice: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  demand: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  analysis: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MarketInsight', marketInsightSchema);