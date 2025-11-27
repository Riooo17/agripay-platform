// components/payments/PaystackPayment.jsx
import React, { useState, useEffect } from 'react';
import { CreditCard, RefreshCw, AlertCircle, X } from 'lucide-react';

const PaystackPayment = ({ 
  amount, 
  email, 
  productName, 
  onSuccess, 
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script dynamically (SAME AS FINANCIAL)
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Paystack script loaded successfully');
      setPaystackLoaded(true);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Paystack script');
      setError('Failed to load payment system. Please refresh the page.');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // REAL Paystack Integration (SAME AS FINANCIAL)
  const initializePayment = () => {
    if (!paystackLoaded) {
      setError('Payment system still loading. Please wait...');
      return;
    }

    if (!window.PaystackPop) {
      setError('Payment system not available. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    // Your LIVE Paystack Public Key (SAME AS FINANCIAL)
    const paystackPublicKey = 'pk_live_cf0f48867990a202a1d8a8ce3ab76a7fdf0998a8';

    // Generate unique reference
    const reference = 'LP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    console.log('💰 Initializing Paystack payment:', {
      email,
      amount,
      reference,
      productName
    });

    try {
      // Create payment handler (SAME AS FINANCIAL)
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: email || 'customer@example.com',
        amount: amount * 100, // Convert to kobo
        currency: 'KES',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Product",
              variable_name: "product_name",
              value: productName
            },
            {
              display_name: "Platform", 
              variable_name: "platform",
              value: "AgriPay Logistics"
            }
          ]
        },
        callback: function(response) {
          // Payment successful
          console.log('✅ Payment successful:', response);
          
          setLoading(false);
          onSuccess({
            amount: amount,
            reference: response.reference,
            transactionId: response.transaction,
            status: 'success'
          });
        },
        onClose: function() {
          // Payment window closed
          console.log('Payment window closed by user');
          setLoading(false);
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('❌ Paystack initialization error:', error);
      setError('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full mx-auto shadow-2xl">
        <div className="bg-green-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-bold">Payment Request</h3>
                <p className="text-green-100">Secure payment via Paystack</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-lg font-semibold"
              disabled={loading}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Service:</span>
              <span className="font-semibold text-gray-800">{productName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="text-2xl font-bold text-green-600">
                KES {amount?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {!paystackLoaded && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                <p className="text-blue-700 text-sm">Loading payment system...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Payment Action */}
          <div className="space-y-3">
            <button
              onClick={initializePayment}
              disabled={loading || !paystackLoaded}
              className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold text-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay via Paystack
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
            >
              Cancel Payment
            </button>
          </div>

          {/* Payment Methods Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              <strong>Accepted Methods:</strong> Card, Bank Transfer, Mobile Money
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaystackPayment;