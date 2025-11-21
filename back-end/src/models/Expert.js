const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  consultationsCompleted: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: '24 hours'
  },
  fee: {
    type: Number,
    required: true
  },
  skills: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expert', expertSchema);