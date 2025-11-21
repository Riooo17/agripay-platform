const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
    default: () => `DR-${Date.now()}`
  },
  customer: {
    name: { type: String, required: true },
    email: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_transit', 'out_for_delivery', 'completed', 'cancelled'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  currentLocation: String,
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Shipment', shipmentSchema);