const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['farmer', 'buyer', 'expert', 'financial', 'logistics', 'input_seller', 'admin'],
    required: true 
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    businessName: String,
    location: {
      address: String,
      county: String,
      subCounty: String,
      ward: String,
      coordinates: { lat: Number, lng: Number }
    },
    avatar: String,
    bio: String
  },
  
  // ✅ FARMER-SPECIFIC FIELDS
  farmerProfile: {
    farmName: String,
    farmSize: {
      value: Number,
      unit: { type: String, enum: ['acres', 'hectares'], default: 'acres' }
    },
    mainCrops: [String],
    farmingExperience: { type: Number, default: 0 }, // in years
    farmingMethods: [{
      type: String,
      enum: ['organic', 'greenhouse', 'open_field', 'hydroponics', 'aquaponics']
    }],
    certifications: [String],
    equipment: [String],
    harvestSchedule: {
      plantingSeason: String,
      harvestSeason: String
    },
    productionCapacity: {
      annual: Number,
      unit: String
    }
  },
  
  // Farmer business details
  business: {
    businessRegistration: String,
    taxNumber: String,
    bankAccount: {
      bankName: String,
      accountNumber: String,
      accountName: String
    }
  },

  isVerified: {
    type: Boolean,
    default: false
  },
  verification: {
    documents: [String],
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verifiedAt: Date
  },
  settings: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
    smsAlerts: { type: Boolean, default: true }
  },
  
  // Farmer statistics (updated automatically)
  stats: {
    totalProducts: { type: Number, default: 0 },
    activeListings: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    customerRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  
  // Farmer preferences
  preferences: {
    preferredBuyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sellingRadius: { type: Number, default: 50 }, // in kilometers
    autoRestock: { type: Boolean, default: false },
    minimumOrder: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Update farmer stats when orders are completed
userSchema.methods.updateFarmerStats = async function() {
  const Order = require('./Order');
  const Review = require('./Review');
  
  const completedOrders = await Order.countDocuments({ 
    farmer: this._id, 
    status: 'delivered' 
  });
  
  const totalRevenue = await Order.aggregate([
    { 
      $match: { 
        farmer: this._id, 
        status: 'delivered',
        paymentStatus: 'completed'
      } 
    },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  
  const activeProducts = await Product.countDocuments({ 
    farmer: this._id, 
    status: 'available' 
  });
  
  const ratingData = await Review.aggregate([
    { $match: { farmer: this._id } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  this.stats.completedOrders = completedOrders;
  this.stats.totalRevenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
  this.stats.activeListings = activeProducts;
  
  if (ratingData.length > 0) {
    this.stats.customerRating = Math.round(ratingData[0].average * 10) / 10;
    this.stats.reviewCount = ratingData[0].count;
  }
  
  await this.save();
};

module.exports = mongoose.model('User', userSchema);