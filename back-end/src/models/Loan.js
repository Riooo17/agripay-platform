const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  loanId: { type: String, unique: true, required: true },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  principalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['active', 'repaying', 'paid_off', 'defaulted'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);