// /back-end/src/models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  permissions: {
    canManageUsers: { type: Boolean, default: true },
    canImpersonate: { type: Boolean, default: true },
    canViewAllDashboards: { type: Boolean, default: true }
  },
  isSuperAdmin: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);