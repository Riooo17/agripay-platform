// models/InputProduct.js
const mongoose = require('mongoose');

const inputProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Seeds', 'Fertilizers', 'Equipment', 'Tools', 'Pesticides', 'Irrigation', 'Protective Gear']
  },
  subCategory: String,
  
  // Pricing and inventory
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  originalPrice: Number,
  unit: { 
    type: String, 
    required: true,
    enum: ['kg', 'g', 'ton', 'bag', 'piece', 'liter', 'pack', 'set']
  },
  stock: { 
    type: Number, 
    required: true,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  minOrder: {
    type: Number,
    default: 1
  },
  
  // Product details
  brand: String,
  specifications: {
    weight: String,
    dimensions: String,
    material: String,
    shelfLife: String,
    usageInstructions: String
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  certifications: [String],
  
  // Media
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Seller reference
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Status and visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // SEO and discovery
  tags: [String],
  searchKeywords: [String],
  
  // Statistics
  stats: {
    views: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    wishlists: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

// Index for better search performance
inputProductSchema.index({ seller: 1, status: 1 });
inputProductSchema.index({ category: 1, status: 1 });

// Update product status based on quantity
inputProductSchema.methods.updateStatus = function() {
  if (this.stock <= 0 && this.status !== 'discontinued') {
    this.status = 'out_of_stock';
  } else if (this.stock > 0 && this.status === 'out_of_stock') {
    this.status = 'active';
  }
  return this.save();
};

module.exports = mongoose.model('InputProduct', inputProductSchema);