const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
  applicationId: { type: String, unique: true, required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  financialInstitution: { type: mongoose.Schema.Types.ObjectId, ref: 'FinancialInstitution', required: true },
  requestedAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['submitted', 'under_review', 'approved', 'rejected'],
    default: 'submitted'
  },
  riskAssessment: {
    creditScore: { type: Number, min: 0, max: 100, default: 50 },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  }
}, { timestamps: true });

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);