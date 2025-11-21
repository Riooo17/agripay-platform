// models/ExpertContent.js
const mongoose = require('mongoose');

const expertContentSchema = new mongoose.Schema({
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true
  },
  type: {
    type: String,
    enum: ['article', 'video', 'webinar'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  videoUrl: {
    type: String
  },
  webinarLink: {
    type: String
  },
  scheduledDate: {
    type: Date
  },
  scheduledTime: {
    type: String
  },
  duration: {
    type: Number
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'completed'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('ExpertContent', expertContentSchema);