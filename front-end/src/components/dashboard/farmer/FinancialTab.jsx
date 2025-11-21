// src/components/dashboard/farmer/FinancialTab.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const FinancialTab = ({ data, transactions, onAddNotification }) => {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState(null);
  const [paymentData, setPaymentData] = useState({
    email: user?.email || '',
    amount: '',
    phone: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  // Calculate financial metrics
  const totalIncome = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (t.total || t.quantity * t.price), 0);

  const pendingIncome = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + (t.total || t.quantity * t.price), 0);

  // REAL Paystack Payment Integration
  const initializePaystackPayment = async () => {
    if (!paymentData.amount || !paymentData.email) {
      alert('Please enter amount and email');
      return;
    }

    setLoading(true);
    
    try {
      // Convert amount to kobo (Paystack uses kobo)
      const amountInKobo = parseInt(paymentData.amount) * 100;

      // Create payment request to backend
      const response = await fetch('http://localhost:5000/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('agripay_token')}`
        },
        body: JSON.stringify({
          email: paymentData.email,
          amount: amountInKobo,
          metadata: {
            farmer_id: user?.id,
            farmer_name: user?.name,
            description: paymentData.description || 'Farm produce payment'
          }
        })
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Initialize Paystack checkout
        const handler = window.PaystackPop.setup({
          key: result.data.publicKey, // From your backend
          email: paymentData.email,
          amount: amountInKobo,
          currency: 'KES',
          ref: result.data.reference,
          metadata: {
            custom_fields: [
              {
                display_name: "Farmer Name",
                variable_name: "farmer_name",
                value: user?.name
              },
              {
                display_name: "Description",
                variable_name: "description", 
                value: paymentData.description
              }
            ]
          },
          callback: function(response) {
            // Payment successful
            console.log('Payment successful:', response);
            handlePaymentSuccess(response);
          },
          onClose: function() {
            // Payment modal closed
            console.log('Payment window closed');
            setLoading(false);
          }
        });

        handler.openIframe();
      } else {
        throw new Error(result.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Paystack error:', error);
      alert('Payment initialization failed: ' + error.message);
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // Verify payment with backend
      const verifyResponse = await fetch('http://localhost:5000/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('agripay_token')}`
        },
        body: JSON.stringify({
          reference: response.reference
        })
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.success) {
        onAddNotification({
          id: Date.now(),
          type: 'payment',
          message: `Payment of KES ${paymentData.amount} received successfully!`,
          time: 'Just now',
          read: false
        });

        alert(`✅ Payment successful! KES ${paymentData.amount} received.`);
        setActiveModal(null);
        setPaymentData({ email: user?.email || '', amount: '', phone: '', description: '' });
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Payment verification failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  // Request Payment from Buyer
  const requestPaymentFromBuyer = async (buyerEmail, amount, description) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/payments/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('agripay_token')}`
        },
        body: JSON.stringify({
          buyer_email: buyerEmail,
          amount: amount * 100, // Convert to kobo
          description: description,
          farmer_name: user?.name,
          farmer_id: user?.id
        })
      });

      const result = await response.json();

      if (result.success) {
        onAddNotification({
          id: Date.now(),
          type: 'payment-request',
          message: `Payment request of KES ${amount} sent to ${buyerEmail}`,
          time: 'Just now',
          read: false
        });
        alert(`✅ Payment request sent to ${buyerEmail}`);
      } else {
        alert('Failed to send payment request: ' + result.message);
      }
    } catch (error) {
      console.error('Request payment error:', error);
      alert('Failed to send payment request');
    } finally {
      setLoading(false);
    }
  };

  // Quick payment templates
  const quickPaymentTemplates = [
    { amount: 1000, description: 'Small order payment' },
    { amount: 5000, description: 'Medium order payment' },
    { amount: 15000, description: 'Large order payment' },
    { amount: 50000, description: 'Bulk order payment' }
  ];

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-green-600">KES {totalIncome.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Income</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">KES {pendingIncome.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Pending Payments</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">KES {data.netProfit?.toLocaleString() || '0'}</div>
          <div className="text-sm text-gray-600">Net Profit</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Tools */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Tools Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">💳 Payment Tools</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setActiveModal('receive-payment')}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2"
              >
                <span>💰</span>
                <span>Receive Payment</span>
              </button>
              <button 
                onClick={() => setActiveModal('request-payment')}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2"
              >
                <span>📩</span>
                <span>Request Payment</span>
              </button>
              <button 
                onClick={() => setActiveModal('quick-payments')}
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2"
              >
                <span>⚡</span>
                <span>Quick Payments</span>
              </button>
              <button 
                onClick={() => setActiveModal('payment-history')}
                className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2"
              >
                <span>📊</span>
                <span>Payment History</span>
              </button>
            </div>
          </div>

          {/* Quick Payment Templates */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">⚡ Quick Payment Amounts</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickPaymentTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setPaymentData(prev => ({
                      ...prev,
                      amount: template.amount,
                      description: template.description
                    }));
                    setActiveModal('receive-payment');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-300 py-3 px-4 rounded-lg font-medium transition duration-200 text-center"
                >
                  <div className="font-semibold">KES {template.amount}</div>
                  <div className="text-xs text-gray-600">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{transaction.product} - {transaction.buyer}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      KES {transaction.total?.toLocaleString() || (transaction.quantity * transaction.price).toLocaleString()}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setActiveModal('receive-payment')}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition duration-200"
              >
                💰 Receive Payment
              </button>
              <button 
                onClick={() => setActiveModal('request-payment')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition duration-200"
              >
                📩 Request Payment
              </button>
              <button 
                onClick={() => {
                  onAddNotification({
                    id: Date.now(),
                    type: 'financial',
                    message: 'Financial report generated successfully',
                    time: 'Just now',
                    read: false
                  });
                  alert('📊 Financial report generated!');
                }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition duration-200"
              >
                📊 Generate Report
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Successful Payments</span>
                <span className="text-sm font-semibold text-green-600">{transactions.filter(t => t.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Payments</span>
                <span className="text-sm font-semibold text-yellow-600">{transactions.filter(t => t.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Processed</span>
                <span className="text-sm font-semibold">KES {totalIncome.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            
            {/* Receive Payment Modal */}
            {activeModal === 'receive-payment' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">💰 Receive Payment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Buyer's Email *</label>
                    <input 
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => setPaymentData({...paymentData, email: e.target.value})}
                      placeholder="buyer@example.com"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount (KES) *</label>
                    <input 
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                      placeholder="1000"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input 
                      type="text"
                      value={paymentData.description}
                      onChange={(e) => setPaymentData({...paymentData, description: e.target.value})}
                      placeholder="Payment for farm produce"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={initializePaystackPayment}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Receive Payment via Paystack'}
                    </button>
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    💡 Buyer will receive a Paystack payment prompt
                  </p>
                </div>
              </div>
            )}

            {/* Request Payment Modal */}
            {activeModal === 'request-payment' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">📩 Request Payment from Buyer</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Buyer's Email *</label>
                    <input 
                      type="email"
                      placeholder="buyer@example.com"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount (KES) *</label>
                    <input 
                      type="number"
                      placeholder="1000"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                      placeholder="Payment request for maize delivery..."
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        const buyerEmail = document.querySelector('input[type="email"]').value;
                        const amount = document.querySelector('input[type="number"]').value;
                        const description = document.querySelector('textarea').value;
                        
                        if (buyerEmail && amount) {
                          requestPaymentFromBuyer(buyerEmail, amount, description);
                          setActiveModal(null);
                        } else {
                          alert('Please enter buyer email and amount');
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex-1"
                    >
                      Send Payment Request
                    </button>
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Close Button for all modals */}
            <div className="p-4 border-t">
              <button 
                onClick={() => setActiveModal(null)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paystack Script Loader */}
      <script src="https://js.paystack.co/v1/inline.js"></script>
    </div>
  );
};

export default FinancialTab;