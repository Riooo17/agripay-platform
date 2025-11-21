// src/components/dashboard/ShoppingCart.jsx
import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';

const ShoppingCart = ({ onClose, onCheckoutSuccess }) => {
  const { items: cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 500;
  const tax = subtotal * 0.14;
  const total = subtotal + shipping + tax - discount;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'AGRI10') {
      setDiscount(subtotal * 0.1);
      setApplyingCoupon(false);
      setCouponCode('');
    } else {
      alert('Invalid coupon code. Try "AGRI10" for 10% off!');
    }
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    console.log('Proceeding to checkout with items:', cartItems);
    
    // Show success message
    alert(`🎉 Order placed successfully!\n\nTotal: KSh ${total.toLocaleString()}\nItems: ${cartItems.reduce((sum, item) => sum + item.quantity, 0)}\nThank you for your purchase!`);
    
    // Clear cart and close
    clearCart();
    onClose();
    
    // Call success callback if provided
    if (onCheckoutSuccess) {
      onCheckoutSuccess();
    }
  };

  const suggestedProducts = [
    {
      id: 101,
      name: 'Organic Fertilizer',
      price: 1200,
      supplier: 'AgroTech Solutions',
      unit: 'bag'
    },
    {
      id: 102,
      name: 'Farm Tools Kit',
      price: 3500,
      supplier: 'Tool Masters',
      unit: 'set'
    }
  ];

  const addSuggestedProduct = (product) => {
    // Use the addItem function from context to properly add the product
    const { addItem } = useCart();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      supplier: product.supplier,
      unit: product.unit,
      quantity: 1
    });
    alert(`✅ ${product.name} added to cart!`);
  };

  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md">
        <div className="flex flex-col h-full bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart
              </h2>
              <p className="text-gray-600 text-sm">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some products to get started</p>
                <button
                  onClick={onClose}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-800 font-semibold text-sm">
                        {item.name?.split(' ').map(w => w[0]).join('').toUpperCase() || 'PD'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name || 'Product'}</h3>
                      <p className="text-gray-600 text-sm truncate">{item.supplier || 'Supplier'}</p>
                      <p className="text-lg font-bold text-gray-900">KSh {item.price?.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Suggested Products */}
            {cartItems.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Frequently Bought Together</h3>
                <div className="space-y-3">
                  {suggestedProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-green-800 text-sm font-medium">🌱</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-gray-600 text-sm">{product.supplier}</p>
                          <p className="text-green-700 font-semibold">KSh {product.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => addSuggestedProduct(product)}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex-shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer - Only show if cart has items */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4 bg-white">
              {/* Coupon Code */}
              {!applyingCoupon ? (
                <button
                  onClick={() => setApplyingCoupon(true)}
                  className="w-full text-center text-green-600 hover:text-green-800 py-2 border border-dashed border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                >
                  + Add Coupon Code
                </button>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Order Summary */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">KSh {subtotal.toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (AGRI10):</span>
                    <span className="font-semibold">-KSh {discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? 'FREE' : `KSh ${shipping}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (14%):</span>
                  <span className="font-semibold text-gray-900">KSh {tax.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout - KSh {total.toLocaleString()}
              </button>

              {/* Security Badges */}
              <div className="flex justify-center space-x-6 text-xs text-gray-600">
                <div className="flex items-center">
                  <span className="mr-1 text-green-600">🔒</span>
                  Secure
                </div>
                <div className="flex items-center">
                  <span className="mr-1 text-green-600">🚚</span>
                  Free Shipping
                </div>
                <div className="flex items-center">
                  <span className="mr-1 text-green-600">💳</span>
                  Paystack
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;