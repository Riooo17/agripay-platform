// models/ExpertProfile.js
const mongoose = require('mongoose');

const expertProfileSchema = new mongoose.Schema({
  // Expert reference
  expert: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  
  // Professional information
  specialization: {
    type: String,
    required: true
  },
  subSpecializations: [String],
  yearsOfExperience: {
    type: Number,
    required: true
  },
  education: [{
    degree: String,
    institution: String,
    year: Number,
    field: String
  }],
  certifications: [{
    name: String,
    issuingOrganization: String,
    year: Number,
    validity: Date
  }],
  
  // Service details
  serviceAreas: [{
    county: String,
    subCounties: [String],
    coordinates: { lat: Number, lng: Number }
  }],
  serviceTypes: [{
    type: String,
    enum: ['video_call', 'field_visit', 'phone_consultation', 'chat_consultation']
  }],
  pricing: {
    hourlyRate: { type: Number, required: true },
    fieldVisitRate: Number,
    packageRates: [{
      name: String,
      duration: Number,
      price: Number,
      features: [String]
    }]
  },
  availability: {
    workingHours: {
      start: String,
      end: String
    },
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    timezone: {
      type: String,
      default: 'Africa/Nairobi'
    }
  },
  
  // Professional profile
  bio: String,
  achievements: [String],
  publications: [{
    title: String,
    publisher: String,
    year: Number,
    link: String
  }],
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['basic', 'intermediate', 'fluent', 'native']
    }
  }],
  
  // Statistics and ratings
  stats: {
    totalConsultations: { type: Number, default: 0 },
    completedConsultations: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 },
    farmerSatisfaction: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 }
  },
  ratings: [{
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
    ratedAt: { type: Date, default: Date.now }
  }],
  
  // Verification and status
  verification: {
    verified: { type: Boolean, default: false },
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    documents: [{
      type: String,
      description: String,
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'on_leave'],
    default: 'active'
  },
  
  // Social and contact information
  contact: {
    phone: String,
    alternatePhone: String,
    email: String,
    website: String,
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String
    }
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('ExpertProfile', expertProfileSchema);