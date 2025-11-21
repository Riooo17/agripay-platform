const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: true,
    unique: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  currentLocation: String,
  currentCargo: String,
  capacity: {
    type: Number,
    required: true
  },
  fuelLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  lastMaintenance: Date,
  nextMaintenance: Date,
  eta: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);