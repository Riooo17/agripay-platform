const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500
  }
});

const wishlistSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

wishlistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

wishlistSchema.statics.getOrCreateWishlist = async function(buyerId) {
  let wishlist = await this.findOne({ buyer: buyerId }).populate('items.product');
  if (!wishlist) {
    wishlist = new this({ buyer: buyerId, items: [] });
    await wishlist.save();
    await wishlist.populate('items.product');
  }
  return wishlist;
};

wishlistSchema.methods.addItem = async function(productId, notes = '') {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (existingItem) {
    throw new Error('Product already in wishlist');
  }
  
  this.items.push({
    product: productId,
    notes: notes,
    addedAt: new Date()
  });
  
  return await this.save();
};

wishlistSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  
  return await this.save();
};

wishlistSchema.methods.clearWishlist = async function() {
  this.items = [];
  return await this.save();
};

module.exports = mongoose.model('Wishlist', wishlistSchema);
