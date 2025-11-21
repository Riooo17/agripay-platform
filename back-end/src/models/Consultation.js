const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  preferredDate: Date,
  preferredTime: String,
  budget: Number,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledDate: Date,
  scheduledTime: String,
  agreedAmount: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Consultation', consultationSchema);