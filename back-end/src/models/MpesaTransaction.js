// src/models/MpesaTransaction.js
const mongoose = require('mongoose');

const mpesaTransactionSchema = new mongoose.Schema({
  // Payment details
  amount: { type: Number, required: true },
  currency: { type: String, default: 'KES' },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'cancelled', 'processing'],
    default: 'pending'
  },
  
  // MPesa specific fields
  phoneNumber: { type: String, required: true },
  checkoutRequestID: { type: String, required: true, unique: true },
  merchantRequestID: String,
  mpesaReceiptNumber: String,
  transactionDate: String,
  
  // Business context
  description: String,
  accountReference: String,
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderType: { 
    type: String, 
    enum: ['input_purchase', 'equipment_rental', 'produce_sale', 'other'],
    required: true 
  },
  
  // Product details
  productName: String,
  productId: String,
  quantity: Number,
  
  // Gateway response
  gatewayResponse: mongoose.Schema.Types.Mixed,
  failureReason: String,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: Date
});

// Indexes for faster queries
mpesaTransactionSchema.index({ checkoutRequestID: 1 });
mpesaTransactionSchema.index({ phoneNumber: 1 });
mpesaTransactionSchema.index({ status: 1 });
mpesaTransactionSchema.index({ farmerId: 1 });
mpesaTransactionSchema.index({ createdAt: -1 });

// Update updatedAt on save
mpesaTransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MpesaTransaction', mpesaTransactionSchema);