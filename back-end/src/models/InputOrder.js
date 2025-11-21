// models/InputOrder.js
const mongoose = require('mongoose');

const inputOrderSchema = new mongoose.Schema({
  // Order identification
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // Parties involved
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Products ordered
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'InputProduct', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 1
    },
    unitPrice: { 
      type: Number, 
      required: true 
    },
    totalPrice: { 
      type: Number, 
      required: true 
    },
    productSnapshot: {
      name: String,
      category: String,
      brand: String,
      unit: String,
      images: [String]
    }
  }],
  
  // Pricing
  subtotal: { 
    type: Number, 
    required: true 
  },
  deliveryFee: { 
    type: Number, 
    default: 0 
  },
  discount: { 
    type: Number, 
    default: 0 
  },
  taxAmount: { 
    type: Number, 
    default: 0 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  
  // Order status
  status: {
    type: String,
    enum: [
      'pending',       // Order placed, waiting seller confirmation
      'confirmed',     // Seller accepted order
      'processing',    // Preparing order for shipment
      'ready',         // Order ready for pickup/delivery
      'shipped',       // In transit
      'out_for_delivery', // With delivery driver
      'delivered',     // Order delivered
      'cancelled',     // Order cancelled
      'refunded'       // Order refunded
    ],
    default: 'pending'
  },
  
  // Payment information
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'cash', 'bank_transfer', 'card'],
    default: 'mpesa'
  },
  mpesaTransaction: {
    transactionCode: String,
    phoneNumber: String,
    amount: Number,
    transactionDate: Date,
    merchantRequestID: String,
    checkoutRequestID: String
  },
  
  // Delivery information
  deliveryType: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'delivery'
  },
  deliveryAddress: {
    contactName: String,
    phone: String,
    county: String,
    subCounty: String,
    address: String,
    landmark: String,
    instructions: String
  },
  pickupLocation: {
    address: String,
    county: String,
    subCounty: String,
    coordinates: { lat: Number, lng: Number },
    pickupInstructions: String,
    businessHours: String
  },
  
  // Delivery tracking
  delivery: {
    driverName: String,
    driverPhone: String,
    vehicleType: String,
    vehicleNumber: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    deliveryProof: [String]
  },
  
  // Timelines
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['customer', 'seller', 'system']
  },
  
  // Communication
  notes: {
    customer: String,
    seller: String
  }
}, { 
  timestamps: true 
});

// Generate order number
inputOrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('InputOrder').countDocuments();
    this.orderNumber = `INP-${Date.now()}${count.toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('InputOrder', inputOrderSchema);