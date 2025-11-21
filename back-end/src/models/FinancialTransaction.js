// models/FinancialTransaction.js
const mongoose = require('mongoose');

const financialTransactionSchema = new mongoose.Schema({
  // Transaction identification
  transactionId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // Transaction parties
  fromUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  toUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  financialInstitution: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Transaction details
  type: {
    type: String,
    required: true,
    enum: [
      'loan_disbursement',
      'loan_repayment',
      'insurance_premium',
      'insurance_claim',
      'fee_payment',
      'refund',
      'commission',
      'penalty'
    ]
  },
  category: {
    type: String,
    enum: ['income', 'expense', 'transfer'],
    required: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'KES'
  },
  
  // Reference to related documents
  reference: {
    loan: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
    insurance: { type: mongoose.Schema.Types.ObjectId, ref: 'InsurancePolicy' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    delivery: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' }
  },
  
  // Payment method
  paymentMethod: {
    type: String,
    required: true,
    enum: ['mpesa', 'bank_transfer', 'cash', 'wallet', 'card']
  },
  paymentDetails: {
    mpesaCode: String,
    bankReference: String,
    walletTransactionId: String,
    cardLastFour: String
  },
  
  // Status and timing
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  transactionDate: { 
    type: Date, 
    default: Date.now 
  },
  completedAt: Date,
  
  // Financial accounting
  accounting: {
    debitAccount: String,
    creditAccount: String,
    glCode: String,
    taxAmount: Number,
    feeAmount: Number,
    netAmount: Number
  },
  
  // Additional information
  description: String,
  notes: String,
  metadata: mongoose.Schema.Types.Mixed,
  
  // Audit trail
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true 
});

// Generate transaction ID
financialTransactionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('FinancialTransaction').countDocuments();
    this.transactionId = `TXN-${Date.now()}${count.toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('FinancialTransaction', financialTransactionSchema);
