// src/components/logistics/PaymentsFinance.jsx
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Download, 
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  BarChart3,
  Receipt
} from 'lucide-react';
import PaystackPayment from '../payments/PaystackPayment'

const PaymentsFinance = () => {
  const [showMPesaModal, setShowMPesaModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayments: 0,
    completedThisMonth: 0,
    averageDeliveryValue: 0
  });

  // Mock transactions data
  useEffect(() => {
    setTransactions([
      {
        id: 'DR-2847',
        amount: 8500,
        customer: 'Fresh Farms Ltd',
        date: '2024-01-20',
        status: 'completed',
        type: 'delivery_payment',
        mpesaReceipt: 'RBT634HGY8',
        phoneNumber: '+254712345678'
      },
      {
        id: 'DR-2846',
        amount: 15200,
        customer: 'Nairobi Market Hub',
        date: '2024-01-20',
        status: 'completed',
        type: 'delivery_payment',
        mpesaReceipt: 'RBT634HGZ9',
        phoneNumber: '+254723456789'
      },
      {
        id: 'DR-2845',
        amount: 6700,
        customer: 'Green Valley Produce',
        date: '2024-01-19',
        status: 'pending',
        type: 'delivery_payment',
        mpesaReceipt: null,
        phoneNumber: '+254734567890'
      },
      {
        id: 'INV-001',
        amount: 4500,
        customer: 'Mombasa Fish Market',
        date: '2024-01-19',
        status: 'completed',
        type: 'service_fee',
        mpesaReceipt: 'RBT634HHA1',
        phoneNumber: '+254745678901'
      }
    ]);

    setStats({
      totalEarnings: 45200,
      pendingPayments: 6700,
      completedThisMonth: 24,
      averageDeliveryValue: 8900
    });
  }, []);

  const initiatePayment = (transaction = null) => {
    setSelectedPayment(transaction);
    setShowMPesaModal(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    // Update transaction status in local state
    if (selectedPayment) {
      setTransactions(transactions.map(t => 
        t.id === selectedPayment.id 
          ? { ...t, status: 'completed', mpesaReceipt: paymentData.transactionId }
          : t
      ));
    }
    setShowMPesaModal(false);
    setSelectedPayment(null);
    
    // Show success message
    alert(`Payment of KES ${paymentData.amount} completed successfully!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'pending': return Clock;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Finance</h1>
          <p className="text-gray-600 mt-1">Manage your earnings, expenses, and M-Pesa transactions</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => initiatePayment()}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Request Payment</span>
          </button>
          <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">KES {stats.totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">KES {stats.pendingPayments.toLocaleString()}</p>
              <p className="text-sm text-orange-600 mt-1">2 payments awaiting</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedThisMonth}</p>
              <p className="text-sm text-blue-600 mt-1">24 successful deliveries</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Delivery Value</p>
              <p className="text-2xl font-bold text-gray-900">KES {stats.averageDeliveryValue.toLocaleString()}</p>
              <p className="text-sm text-purple-600 mt-1">Steady growth</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="h-4 w-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <RefreshCw className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const StatusIcon = getStatusIcon(transaction.status);
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-600' :
                        transaction.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{transaction.id}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{transaction.customer}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">KES {transaction.amount.toLocaleString()}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {transaction.status === 'pending' && (
                          <button
                            onClick={() => initiatePayment(transaction)}
                            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                          >
                            Collect
                          </button>
                        )}
                        {transaction.mpesaReceipt && (
                          <span className="text-xs text-gray-500">Receipt: {transaction.mpesaReceipt}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Payment Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => initiatePayment()}
                className="w-full flex items-center space-x-3 bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <DollarSign className="h-5 w-5" />
                <span className="font-semibold">Request Payment</span>
              </button>
              <button className="w-full flex items-center space-x-3 bg-white border border-gray-300 text-gray-700 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <Receipt className="h-5 w-5" />
                <span className="font-semibold">Generate Invoice</span>
              </button>
              <button className="w-full flex items-center space-x-3 bg-white border border-gray-300 text-gray-700 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="h-5 w-5" />
                <span className="font-semibold">View Reports</span>
              </button>
            </div>
          </div>

          {/* Payment Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'M-Pesa Success Rate', value: 98, color: 'bg-green-500' },
                { label: 'Instant Payments', value: 85, color: 'bg-blue-500' },
                { label: 'Auto-reconciliation', value: 92, color: 'bg-purple-500' },
                { label: 'Customer Satisfaction', value: 96, color: 'bg-yellow-500' }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{stat.label}</span>
                    <span className="font-medium text-gray-900">{stat.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${stat.color}`}
                      style={{ width: `${stat.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa Payment Modal */}
      {showMPesaModal && (
        <PaystackPayment
          amount={selectedPayment?.amount || 0}
          phoneNumber={selectedPayment?.phoneNumber || ''}
          productName={selectedPayment ? `Delivery ${selectedPayment.id}` : 'Logistics Service'}
          onSuccess={handlePaymentSuccess}
          onClose={() => {
            setShowMPesaModal(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default PaymentsFinance;
