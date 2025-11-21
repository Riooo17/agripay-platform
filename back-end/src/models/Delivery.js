// models/Delivery.js
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  // Delivery identification
  deliveryNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // Order reference
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  orderType: {
    type: String,
    enum: ['farmer_order', 'input_order'],
    required: true
  },
  
  // Parties involved
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Delivery details
  pickupLocation: {
    address: String,
    county: String,
    subCounty: String,
    coordinates: { lat: Number, lng: Number },
    contactPerson: String,
    contactPhone: String
  },
  deliveryLocation: {
    address: String,
    county: String,
    subCounty: String,
    coordinates: { lat: Number, lng: Number },
    contactPerson: String,
    contactPhone: String
  },
  
  // Cargo information
  cargoDescription: String,
  cargoType: {
    type: String,
    enum: ['perishable', 'fragile', 'general', 'hazardous', 'refrigerated'],
    default: 'general'
  },
  weight: Number,
  volume: String,
  specialInstructions: String,
  
  // Delivery status and tracking
  status: {
    type: String,
    enum: [
      'pending',           // Awaiting pickup
      'accepted',          // Logistics accepted delivery
      'picked_up',         // Package collected from sender
      'in_transit',        // On the way to destination
      'out_for_delivery',  // With delivery driver
      'delivered',         // Successfully delivered
      'cancelled',         // Delivery cancelled
      'delayed',           // Delivery delayed
      'returned'           // Returned to sender
    ],
    default: 'pending'
  },
  
  // Driver and vehicle assignment
  assignedDriver: {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    assignedAt: Date
  },
  
  // Tracking information
  currentLocation: {
    coordinates: { lat: Number, lng: Number },
    address: String,
    timestamp: Date
  },
  route: {
    optimizedRoute: [{
      lat: Number,
      lng: Number,
      timestamp: Date
    }],
    distance: Number, // in kilometers
    estimatedDuration: Number, // in minutes
    actualDuration: Number // in minutes
  },
  
  // Timelines
  estimatedPickup: Date,
  actualPickup: Date,
  estimatedDelivery: Date,
  actualDelivery: Date,
  
  // Cold chain monitoring (for perishable goods)
  coldChainMonitoring: {
    required: { type: Boolean, default: false },
    currentTemp: Number,
    minTemp: Number,
    maxTemp: Number,
    humidity: Number,
    qualityScore: Number, // 0-100
    alerts: [{
      type: String,
      timestamp: Date,
      severity: { type: String, enum: ['low', 'medium', 'high'] }
    }]
  },
  
  // Payment information
  deliveryFee: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'cash', 'bank_transfer', 'wallet'],
    default: 'mpesa'
  },
  
  // Real-time tracking
  trackingEvents: [{
    event: String,
    location: {
      coordinates: { lat: Number, lng: Number },
      address: String
    },
    timestamp: { type: Date, default: Date.now },
    notes: String
  }],
  
  // Ratings and feedback
  rating: {
    fromSender: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      ratedAt: Date
    },
    fromReceiver: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      ratedAt: Date
    }
  }
}, { 
  timestamps: true 
});

// Generate delivery number
deliverySchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Delivery').countDocuments();
    this.deliveryNumber = `DR-${Date.now()}${count.toString().padStart(4, '0')}`;
  }
  next();
});

// Index for geospatial queries
deliverySchema.index({ 'currentLocation.coordinates': '2dsphere' });
deliverySchema.index({ status: 1, estimatedDelivery: 1 });

module.exports = mongoose.model('Delivery', deliverySchema);