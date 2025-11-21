// models/KnowledgeContent.js
const mongoose = require('mongoose');

const knowledgeContentSchema = new mongoose.Schema({
  // Content identification
  contentId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // Author information
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Content details
  type: {
    type: String,
    required: true,
    enum: ['article', 'video_tutorial', 'webinar', 'research_paper', 'guide']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: String,
  tags: [String],
  category: {
    type: String,
    required: true,
    enum: [
      'crop_production',
      'livestock',
      'soil_health',
      'pest_management',
      'irrigation',
      'sustainable_farming',
      'business_management',
      'technology',
      'market_access'
    ]
  },
  
  // Media and attachments
  featuredImage: String,
  attachments: [{
    type: String,
    description: String,
    fileType: String
  }],
  
  // For videos and webinars
  mediaDetails: {
    duration: Number, // in minutes
    videoUrl: String,
    thumbnail: String,
    transcript: String,
    scheduledDate: Date,
    actualDate: Date,
    attendees: Number,
    recordingUrl: String
  },
  
  // Status and visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived', 'rejected'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'premium', 'private'],
    default: 'public'
  },
  publishedAt: Date,
  
  // Engagement metrics
  engagement: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    averageTimeSpent: Number, // in seconds
    completionRate: Number // for videos/webinars
  },
  
  // Comments and interactions
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    timestamp: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    replies: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reply: String,
      timestamp: { type: Date, default: Date.now }
    }]
  }],
  
  // SEO and discovery
  meta: {
    description: String,
    keywords: [String],
    slug: String
  },
  
  // Monetization
  monetization: {
    isPremium: { type: Boolean, default: false },
    price: Number,
    revenue: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

// Generate content ID
knowledgeContentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('KnowledgeContent').countDocuments();
    this.contentId = `KNO-${Date.now()}${count.toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('KnowledgeContent', knowledgeContentSchema);