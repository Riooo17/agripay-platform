const mongoose = require('mongoose');

const coldChainUnitSchema = new mongoose.Schema({
  unitId: {
    type: String,
    required: true,
    unique: true,
    default: () => `CCU-${Date.now()}`
  },
  cargo: {
    type: String,
    required: true
  },
  currentTemperature: {
    type: Number,
    required: true
  },
  targetTemperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 95
  },
  alertLevel: {
    type: String,
    enum: ['Stable', 'Watch', 'Warning', 'Critical'],
    default: 'Stable'
  },
  shipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment'
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  eta: String,
  lastUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ColdChainUnit', coldChainUnitSchema);