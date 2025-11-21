const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    enum: ['maize', 'beans', 'tomatoes', 'wheat', 'coffee', 'tea', 'potatoes', 'cabbage', 'onions', 'other']
  },
  variety: {
    type: String,
    required: true
  },
  plantingDate: {
    type: Date,
    required: true
  },
  harvestDate: {
    type: Date
  },
  farmSize: {
    type: Number, // in acres
    required: true,
    min: 0.1
  },
  expectedYield: {
    type: Number, // in kg
    required: true
  },
  actualYield: {
    type: Number // in kg
  },
  totalCosts: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['planted', 'growing', 'harvested', 'sold'],
    default: 'planted'
  }
}, {
  timestamps: true
});

// Calculate profitability
cropSchema.virtual('profit').get(function() {
  return this.totalRevenue - this.totalCosts;
});

cropSchema.virtual('profitPerAcre').get(function() {
  return this.profit / this.farmSize;
});

module.exports = mongoose.model('Crop', cropSchema);