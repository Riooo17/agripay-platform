const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentReference: { type: String, unique: true, required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ['loan_repayment', 'insurance_premium'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);