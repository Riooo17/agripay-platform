// src/components/dashboard/PaymentsFinance.jsx
import React, { useState, useEffect } from 'react';
import PaystackPayment from '../payments/PaystackPayment';
import { buyerService } from '../../services/buyerService';

const PaymentsFinance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load real payment data from backend
  useEffect(() => {
    const loadPaymentData = async () => {
      setLoading(true);
      console.log('🔄 Loading real payment data...');
      
      try {
        // In a real app, you'd have endpoints like:
        // /api/buyer/payments/history
        // /api/buyer/payments/pending
        const [ordersData] = await Promise.all([
          buyerService.getOrders()
        ]);

        // Process orders to extract payment information
        if (ordersData && ordersData.length > 0) {
          const completedPayments = ordersData
            .filter(order => order.status === 'delivered' || order.paymentStatus === 'completed')
            .map(order => ({
              id: order._id || order.id,
              orderId: order.orderNumber || order._id,
              product: order.productName || order.product?.name || 'Agricultural Product',
              amount: order.amount || order.totalAmount || 0,
              date: order.orderDate || order.createdAt,
              status: 'completed',
              method: 'Paystack',
              transactionId: order.transactionId || `PS_${order._id}`
            }));

          const pendingOrders = ordersData
            .filter(order => order.paymentStatus === 'pending' || !order.paymentStatus)
            .map(order => ({
              id: order._id || order.id,
              product: order.productName || order.product?.name || 'Agricultural Product',
              amount: order.amount || order.totalAmount || 0,
              supplier: order.supplier?.name || order.supplier || 'Supplier',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
              quantity: order.quantity || 1,
              unit: order.unit || 'kg'
            }));

          setPaymentHistory(completedPayments);
          setPendingPayments(pendingOrders);
          console.log('✅ Payment data loaded:', { 
            completed: completedPayments.length, 
            pending: pendingOrders.length 
          });
        } else {
          console.log('ℹ️ No payment data found');
          setPaymentHistory([]);
          setPendingPayments([]);
        }
      } catch (error) {
        console.error('❌ Failed to load payment data:', error);
        setPaymentHistory([]);
        setPendingPayments([]);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentData();
  }, []);

  const handlePayNow = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    // Show success notification
    alert(`🎉 Payment Completed!\n\n💰 KSh ${paymentData.amount.toLocaleString()}\n📦 ${paymentData.productName}\n✅ Transaction successful`);
    
    setShowPaymentModal(false);
    setSelectedPayment(null);
    
    // Refresh payment data after successful payment
    console.log('Payment successful, refreshing data...');
    // You would typically call an API to update order payment status
    // For now, we'll just reload the data
    setTimeout(() => {
      window.location.reload(); // Simple refresh for demo
    }, 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalPending = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalSpent = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = paymentHistory.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-800 mb-2">💳 Payments & Finance</h1>
          <p className="text-blue-600">Loading your payment data...</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-blue-800 font-semibold">Loading payment history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">💳 Payments & Finance</h1>
        <p className="text-blue-600">Secure payments with Paystack - Cards, M-Pesa & Bank Transfers</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Spent</p>
              <p className="text-3xl font-bold mt-1">KSh {totalSpent.toLocaleString()}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
          <p className="text-blue-100 text-sm mt-2">{completedPayments} completed payments</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Payments</p>
              <p className="text-3xl font-bold mt-1">KSh {totalPending.toLocaleString()}</p>
            </div>
            <div className="text-3xl">⏰</div>
          </div>
          <p className="text-yellow-100 text-sm mt-2">{pendingPayments.length} orders pending</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Paystack Ready</p>
              <p className="text-3xl font-bold mt-1">Multi-Pay</p>
            </div>
            <div className="text-3xl">💳</div>
          </div>
          <p className="text-green-100 text-sm mt-2">Cards, M-Pesa & Banks</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100">
        <div className="border-b border-blue-200">
          <nav className="flex -mb-px">
            {['pending', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-blue-500 hover:text-blue-700 hover:border-blue-300'
                }`}
              >
                {tab === 'pending' && `Pending Payments (${pendingPayments.length})`}
                {tab === 'history' && `Payment History (${paymentHistory.length})`}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingPayments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 text-lg">📦</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-900">{payment.product}</h3>
                      <p className="text-yellow-600 text-sm">
                        {payment.supplier} • {payment.quantity} {payment.unit} • Due {formatDate(payment.dueDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-yellow-800">KSh {payment.amount.toLocaleString()}</p>
                      <button 
                        onClick={() => handlePayNow(payment)}
                        className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-sm"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {pendingPayments.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">All Caught Up!</h3>
                  <p className="text-blue-600">No pending payments</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {paymentHistory.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-lg">✅</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900">{payment.product}</h3>
                      <p className="text-blue-600 text-sm">
                        Order {payment.orderId} • {formatDate(payment.date)} • {payment.transactionId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-800">KSh {payment.amount.toLocaleString()}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {paymentHistory.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💳</div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">No Payment History</h3>
                  <p className="text-blue-600">Your completed payments will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Paystack Instructions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
        <h3 className="text-lg font-bold text-blue-800 mb-4">🚀 How to Pay with Paystack</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">1️⃣</div>
            <p className="font-semibold text-blue-800">Click Pay Now</p>
            <p className="text-blue-600 text-sm mt-1">Select any pending payment</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">2️⃣</div>
            <p className="font-semibold text-blue-800">Enter Email</p>
            <p className="text-blue-600 text-sm mt-1">For payment receipt</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">3️⃣</div>
            <p className="font-semibold text-blue-800">Choose Method</p>
            <p className="text-blue-600 text-sm mt-1">Card, M-Pesa or Bank</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">4️⃣</div>
            <p className="font-semibold text-blue-800">Complete</p>
            <p className="text-blue-600 text-sm mt-1">Follow payment instructions</p>
          </div>
        </div>
      </div>

      {/* Payment Methods Info */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">💳 Available Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg">
            <div className="text-2xl mb-2">💳</div>
            <p className="font-semibold">Credit/Debit Cards</p>
            <p className="text-sm opacity-90 mt-1">Visa, Mastercard, Verve</p>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg">
            <div className="text-2xl mb-2">📱</div>
            <p className="font-semibold">M-Pesa</p>
            <p className="text-sm opacity-90 mt-1">Mobile Money</p>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg">
            <div className="text-2xl mb-2">🏦</div>
            <p className="font-semibold">Bank Transfer</p>
            <p className="text-sm opacity-90 mt-1">Direct Bank Payments</p>
          </div>
        </div>
      </div>

      {/* Support Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">💬</div>
          <div>
            <h4 className="font-semibold text-blue-800">Need Help with Payments?</h4>
            <p className="text-blue-600 text-sm">Contact support: payments@agripayafrica.com | +254 700 123 456</p>
          </div>
        </div>
      </div>

      {/* Paystack Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <PaystackPayment
          amount={selectedPayment.amount}
          email="customer@agripay.com" // You can get this from user context
          productName={selectedPayment.product}
          onSuccess={handlePaymentSuccess}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default PaymentsFinance;