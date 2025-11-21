const mongoose = require('mongoose');

const InsurancePolicySchema = new mongoose.Schema({
  policyNumber: { type: String, unique: true, required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyType: { 
    type: String, 
    enum: ['crop_insurance', 'livestock_insurance', 'equipment_insurance'],
    required: true 
  },
  sumInsured: { type: Number, required: true },
  premium: { type: Number, required: true },
  status: {
    type: String,
    enum: ['active', 'pending', 'expired'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('InsurancePolicy', InsurancePolicySchema);