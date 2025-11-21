const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  financialInstitution: { type: mongoose.Schema.Types.ObjectId, ref: 'FinancialInstitution', required: true },
  riskProfile: {
    creditScore: { type: Number, min: 0, max: 100, default: 50 },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  },
  portfolio: {
    totalAmountBorrowed: { type: Number, default: 0 },
    currentOutstanding: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);