// components/payments/PaystackPayment.jsx
import React, { useState, useEffect } from 'react';
import { CreditCard, RefreshCw, AlertCircle, CheckCircle, Shield } from 'lucide-react';

const PaystackPayment = ({ 
  amount, 
  email, 
  productName, 
  description = '',
  onSuccess, 
  onClose,
  userType = 'customer', // 'farmer', 'logistics', 'buyer'
  metadata = {}
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script dynamically
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

  // Get user type display name
  const getUserTypeDisplay = () => {
    const types = {
      'farmer': 'Farmer',
      'logistics': 'Logistics Partner', 
      'buyer': 'Buyer',
      'customer': 'Customer'
    };
    return types[userType] || 'User';
  };

  // Generate reference based on user type
  const generateReference = () => {
    const prefixes = {
      'farmer': 'FARMER_',
      'logistics': 'LP_', 
      'buyer': 'BUYER_',
      'customer': 'CUST_'
    };
    const prefix = prefixes[userType] || 'PAY_';
    return prefix + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Unified Paystack Integration
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

    // Use environment variable with fallback
    const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_cf0f48867990a202a1d8a8ce3ab76a7fdf0998a8';

    const reference = generateReference();

    console.log('💰 Payment Initializing:', {
      userType,
      productName,
      amount,
      reference,
      email
    });

    try {
      // Default metadata fields
      const defaultMetadata = {
        custom_fields: [
          {
            display_name: "User Type",
            variable_name: "user_type",
            value: getUserTypeDisplay()
          },
          {
            display_name: "Product/Service",
            variable_name: "product_name",
            value: productName
          },
          {
            display_name: "Description",
            variable_name: "description", 
            value: description || productName
          }
        ]
      };

      // Merge with provided metadata
      const finalMetadata = {
        ...defaultMetadata,
        ...metadata,
        custom_fields: [
          ...defaultMetadata.custom_fields,
          ...(metadata.custom_fields || [])
        ]
      };

      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: email || 'user@example.com',
        amount: amount * 100, // Convert to kobo
        currency: 'KES',
        ref: reference,
        metadata: finalMetadata,
        callback: function(response) {
          console.log('✅ Payment successful:', response);
          
          setLoading(false);
          onSuccess({
            amount: amount,
            reference: response.reference,
            transactionId: response.transaction,
            status: 'success',
            productName: productName,
            userType: userType
          });
        },
        onClose: function() {
          console.log('Payment window closed by user');
          setLoading(false);
          // Optional: Call onClose with a cancelled status
          // onClose('cancelled');
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      setError('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full mx-auto shadow-2xl">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Complete Payment</h3>
                <p className="text-green-100">Secure payment via Paystack</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-lg font-semibold transition-colors"
              disabled={loading}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold text-gray-800 text-right">{productName}</span>
              </div>
              {description && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-medium text-gray-800 text-right text-sm max-w-xs">{description}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-gray-600">Amount:</span>
                <span className="text-2xl font-bold text-green-600">
                  KES {amount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <Shield className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-green-700 text-sm font-medium">Secure & Encrypted Payment</span>
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
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Payment Action */}
          <div className="space-y-3">
            <button
              onClick={initializePayment}
              disabled={loading || !paystackLoaded}
              className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay KES {amount?.toLocaleString()}
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 transition-colors"
            >
              Cancel Payment
            </button>
          </div>

          {/* Payment Methods Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              <strong>Accepted Methods:</strong> Card • Bank Transfer • Mobile Money
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaystackPayment;