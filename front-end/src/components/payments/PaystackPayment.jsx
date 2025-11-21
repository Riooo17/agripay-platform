// src/components/payments/PaystackPayment.jsx
import React, { useState } from 'react';

const PaystackPayment = ({ 
  amount, 
  email: initialEmail, 
  phoneNumber: initialPhone,
  productName, 
  onSuccess, 
  onClose
}) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const initiatePayment = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:5000/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: email,
          amount: amount,
          metadata: {
            product_name: productName,
            customer_phone: phoneNumber,
            business: 'AgriPay'
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url;
      } else {
        alert(data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full mx-auto shadow-2xl">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💳</div>
              <div>
                <h3 className="text-xl font-bold">Pay with Paystack</h3>
                <p className="text-blue-100">Cards • M-Pesa • Banks</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-lg font-semibold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Product:</span>
              <span className="font-semibold text-gray-800">{productName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total:</span>
              <span className="text-2xl font-bold text-blue-600">KES {amount?.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Payment Methods Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Available Payment Methods:</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-lg">💳</div>
                  <div className="text-blue-700">Cards</div>
                </div>
                <div className="text-center">
                  <div className="text-lg">📱</div>
                  <div className="text-blue-700">M-Pesa</div>
                </div>
                <div className="text-center">
                  <div className="text-lg">🏦</div>
                  <div className="text-blue-700">Banks</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-300 rounded-lg p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Payment receipt will be sent to this email
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XXXXXXXX"
                className="w-full border border-gray-300 rounded-lg p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={initiatePayment}
                disabled={!email || isProcessing}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold text-lg transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
              
              <button
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>

            {/* Security Info */}
            <div className="text-center text-xs text-gray-500">
              <p>🔒 Secure payment powered by Paystack</p>
              <p>Your payment details are encrypted and secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaystackPayment;