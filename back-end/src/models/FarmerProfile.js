const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  farmName: String,
  farmLocation: String,
  farmSize: Number,
  crops: [String],
  equipment: [String],
  certifications: [String],
  bio: String,
  experience: Number,
  bankName: String,
  accountNumber: String,
  accountName: String
}, { 
  timestamps: true 
});

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);