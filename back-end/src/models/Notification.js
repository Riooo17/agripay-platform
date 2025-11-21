const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'payment', 'delivery', 'system', 'promotion', 'alert'],
    required: true
  },
  relatedEntity: {
    type: {
      type: String,
      enum: ['order', 'product', 'payment', 'delivery']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  read: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  actionUrl: String,
  expiresAt: Date
}, {
  timestamps: true
});

// TTL index for auto-deletion of expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for efficient queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
