// src/pages/FinancialDashboard.jsx - FIXED PAYSTACK SCRIPT LOADING
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Shield, TrendingUp, Bell, Settings, 
  Filter, Download, Eye, Edit, Trash2, Plus, Search,
  Calendar, DollarSign, PieChart, MapPin, Activity,
  CreditCard, Smartphone, Wallet, Target, Home,
  FileText, ShieldCheck, UserCheck, Clock, CheckCircle, 
  XCircle, Phone, Mail, Map, Star, AlertCircle,
  RefreshCw, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { financialAPI, paystackAPI } from '../services/api';

// REAL Paystack Payment Component - FIXED SCRIPT LOADING
const PaystackPayment = ({ 
  client, 
  amount, 
  productName, 
  onSuccess, 
  onClose 
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
      // Cleanup if component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // REAL Paystack Integration
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

    // Your LIVE Paystack Public Key
    const paystackPublicKey = 'pk_live_cf0f48867990a202a1d8a8ce3ab76a7fdf0998a8';

    // Generate unique reference
    const reference = 'AP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    console.log('💰 Initializing Paystack payment:', {
      client: client.user?.name,
      amount,
      reference,
      paystackLoaded
    });

    try {
      // Create payment handler
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: client.user?.email || 'customer@example.com',
        amount: amount * 100, // Convert to kobo
        currency: 'KES',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Client Name",
              variable_name: "client_name",
              value: client.user?.name || 'Unknown Client'
            },
            {
              display_name: "Product",
              variable_name: "product_name",
              value: productName
            },
            {
              display_name: "Client ID", 
              variable_name: "client_id",
              value: client._id || 'unknown'
            }
          ]
        },
        callback: function(response) {
          // Payment successful
          console.log('✅ Payment successful:', response);
          
          setLoading(false);
          onSuccess({
            amount: amount,
            client: client,
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
              <span className="text-gray-600">Client:</span>
              <span className="font-semibold text-gray-800">{client.user?.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Product:</span>
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

// Application Preview Modal (UNCHANGED)
const ApplicationPreview = ({ application, onClose, onApprove, onReject }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(application._id);
    setIsProcessing(false);
    onClose();
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(application._id);
    setIsProcessing(false);
    onClose();
  };

  if (!application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-amber-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📄</div>
              <div>
                <h3 className="text-xl font-bold">Loan Application Preview</h3>
                <p className="text-green-100">Complete application details</p>
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

        <div className="p-6 space-y-6">
          {/* Applicant Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Applicant Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name:</span>
                  <span className="font-medium">{application.farmer?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Application ID:</span>
                  <span className="font-medium">{application.applicationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Application Date:</span>
                  <span className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Farm Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Farm Size:</span>
                  <span className="font-medium">{application.farmDetails?.size?.value} {application.farmDetails?.size?.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Main Crop:</span>
                  <span className="font-medium">{application.farmDetails?.mainCrop || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{application.farmDetails?.location?.county || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Loan Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  KES {application.loanDetails?.requestedAmount?.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-gray-600">Requested Amount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {application.loanDetails?.repaymentPeriod?.value} {application.loanDetails?.repaymentPeriod?.unit}
                </div>
                <div className="text-sm text-gray-600">Loan Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {application.riskAssessment?.creditScore || 0}/100
                </div>
                <div className="text-sm text-gray-600">Credit Score</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Purpose:</div>
              <div className="font-medium">{application.loanDetails?.purposeDescription || application.loanDetails?.purpose}</div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Risk Assessment</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Risk Level:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.riskAssessment?.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                  application.riskAssessment?.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {application.riskAssessment?.riskLevel?.toUpperCase() || 'MEDIUM'} Risk
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    application.riskAssessment?.riskLevel === 'low' ? 'bg-green-500' :
                    application.riskAssessment?.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${application.riskAssessment?.creditScore || 50}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                Based on AgriPay transaction history, farm performance data, and market conditions.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isProcessing ? (
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve Application
                </>
              )}
            </button>
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isProcessing ? (
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <>
                  <XCircle className="h-5 w-5 mr-2" />
                  Reject Application
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component (UNCHANGED STRUCTURE)
const FinancialDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPaystack, setShowPaystack] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    loanApplications: [],
    clients: [],
    insurancePolicies: [],
    stats: null
  });

  // Fetch data from backend (UNCHANGED)
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [applicationsRes, clientsRes, policiesRes, statsRes] = await Promise.all([
        financialAPI.getLoanApplications('pending'),
        financialAPI.getClients(),
        financialAPI.getInsurancePolicies(),
        financialAPI.getDashboardStats()
      ]);

      setData({
        loanApplications: applicationsRes.data?.applications || applicationsRes.data || [],
        clients: clientsRes.data?.clients || clientsRes.data || [],
        insurancePolicies: policiesRes.data?.policies || policiesRes.data || [],
        stats: statsRes.data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({
        loanApplications: [],
        clients: [],
        insurancePolicies: [],
        stats: null
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Calculate metrics from real data (UNCHANGED)
  const pendingLoansCount = data.loanApplications.filter(app => 
    app.status === 'submitted' || app.status === 'under_review'
  ).length;

  const pendingInsuranceCount = data.insurancePolicies.filter(policy => 
    policy.status === 'application' || policy.status === 'under_review'
  ).length;

  const totalOutstanding = data.clients.reduce((sum, client) => 
    sum + (client.portfolio?.currentOutstanding || 0), 0
  );

  const totalPortfolioValue = data.clients.reduce((sum, client) => 
    sum + (client.portfolio?.totalAmountBorrowed || 0), 0
  );

  // Search functionality (UNCHANGED)
  const filteredLoanApplications = data.loanApplications.filter(app =>
    app.farmer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.farmDetails?.mainCrop?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.farmDetails?.location?.county?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.loanDetails?.requestedAmount?.toString().includes(searchQuery)
  );

  const filteredClients = data.clients.filter(client =>
    client.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.user?.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.portfolio?.products?.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Action handlers (UNCHANGED)
  const handleApproveLoan = async (applicationId, approvalData = {}) => {
    try {
      setIsProcessing(true);
      await financialAPI.approveLoan(applicationId, approvalData);
      await fetchData();
    } catch (error) {
      console.error('Error approving loan:', error);
      alert('Failed to approve loan: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectLoan = async (applicationId, rejectionData = {}) => {
    try {
      setIsProcessing(true);
      await financialAPI.rejectLoan(applicationId, rejectionData);
      await fetchData();
    } catch (error) {
      console.error('Error rejecting loan:', error);
      alert('Failed to reject loan: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // UPDATED: Real Paystack payment handler
  const handleRequestPayment = (client, amount = null) => {
    setSelectedItem(client);
    setShowPaystack(true);
  };

  // UPDATED: Handle successful Paystack payment
  const handlePaystackSuccess = async (paymentData) => {
    console.log('💰 Payment successful:', paymentData);
    
    // Update client payment status in your backend
    try {
      await financialAPI.recordPayment({
        clientId: paymentData.client._id,
        amount: paymentData.amount,
        reference: paymentData.reference,
        transactionId: paymentData.transactionId,
        status: 'completed'
      });
      
      // Refresh data to show updated balances
      await fetchData();
      
      // Show success message
      alert(`Payment of KES ${paymentData.amount.toLocaleString()} received successfully!`);
      
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Payment received but failed to update records. Please check manually.');
    }
    
    setShowPaystack(false);
    setSelectedItem(null);
  };

  const handleApproveInsurance = async (policyId) => {
    try {
      setIsProcessing(true);
      await financialAPI.approveInsurance(policyId);
      await fetchData();
    } catch (error) {
      console.error('Error approving insurance:', error);
      alert('Failed to approve insurance: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectInsurance = async (policyId) => {
    try {
      setIsProcessing(true);
      await financialAPI.rejectInsurance(policyId);
      await fetchData();
    } catch (error) {
      console.error('Error rejecting insurance:', error);
      alert('Failed to reject insurance: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewApplication = (application) => {
    setSelectedItem(application);
    setShowPreview(true);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  // Render methods (UNCHANGED - keep all your existing renderOverview, renderLoans, renderClients, renderInsurance)
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Portfolio</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.stats?.totalPortfolioValue ? `KES ${data.stats.totalPortfolioValue.toLocaleString()}` : 'KES 0'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            {data.clients.length} active clients
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
              <p className="text-2xl font-bold text-gray-900">KES {totalOutstanding.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-600">
            From {data.clients.length} clients
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{pendingLoansCount + pendingInsuranceCount}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('loans')}
            className="mt-4 w-full bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Review Now
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Policies</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.insurancePolicies.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ShieldCheck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-purple-600">
            {pendingInsuranceCount} pending approval
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('loans')}
              className="w-full flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-700">Review Loan Applications</span>
              </div>
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                {pendingLoansCount} new
              </div>
            </button>
            
            <button 
              onClick={() => setActiveTab('insurance')}
              className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
            >
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium text-gray-700">Process Insurance Policies</span>
              </div>
              <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-sm">
                {pendingInsuranceCount} pending
              </div>
            </button>
            
            <button 
              onClick={() => setActiveTab('clients')}
              className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-700">Manage Client Payments</span>
              </div>
              <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                {data.clients.length} clients
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Due Soon</h3>
          <div className="space-y-3">
            {data.clients.slice(0, 3).map(client => (
              <div key={client._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{client.user?.name}</p>
                  <p className="text-sm text-gray-500">
                    Due: Soon • KES {(client.portfolio?.currentOutstanding || 0).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => handleRequestPayment(client)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Request
                </button>
              </div>
            ))}
            {data.clients.length > 3 && (
              <button 
                onClick={() => setActiveTab('clients')}
                className="w-full text-center text-green-600 font-medium py-2 hover:text-green-700"
              >
                View all {data.clients.length} clients →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoans = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Loan Applications Review</h2>
              <p className="text-sm text-gray-500">
                {pendingLoansCount} pending applications • 
                KES {data.loanApplications.reduce((sum, app) => sum + (app.loanDetails?.requestedAmount || 0), 0).toLocaleString()} total requested
              </p>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, crop, location..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farm Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoanApplications.map(app => (
                <tr key={app._id} className="hover:bg-amber-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-r from-green-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                        {app.farmer?.name?.charAt(0) || 'F'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{app.farmer?.name || 'Unknown Farmer'}</div>
                        <div className="text-sm text-gray-500">{app.applicationId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      KES {(app.loanDetails?.requestedAmount || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {app.loanDetails?.repaymentPeriod?.value} {app.loanDetails?.repaymentPeriod?.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{app.farmDetails?.mainCrop}</div>
                    <div className="text-sm text-gray-500">
                      {app.farmDetails?.size?.value} {app.farmDetails?.size?.unit} • {app.farmDetails?.location?.county}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            app.riskAssessment?.riskLevel === 'low' ? 'bg-green-500' :
                            app.riskAssessment?.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${app.riskAssessment?.creditScore || 50}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        app.riskAssessment?.riskLevel === 'low' ? 'text-green-600' :
                        app.riskAssessment?.riskLevel === 'medium' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {app.riskAssessment?.creditScore || 50}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleViewApplication(app)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4 inline mr-1" />
                      View
                    </button>
                    <button 
                      onClick={() => handleApproveLoan(app._id)}
                      disabled={isProcessing}
                      className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Approve
                    </button>
                    <button 
                      onClick={() => handleRejectLoan(app._id)}
                      disabled={isProcessing}
                      className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4 inline mr-1" />
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLoanApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No loan applications found
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Active Clients Portfolio</h2>
              <p className="text-sm text-gray-500">
                {data.clients.length} clients • KES {totalOutstanding.toLocaleString()} total outstanding
              </p>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search clients by name, location..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map(client => (
                <tr key={client._id} className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {client.user?.name?.charAt(0) || 'C'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.user?.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Map className="h-3 w-3 mr-1" />
                          {client.user?.location || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.user?.phone}</div>
                    <div className="text-sm text-gray-500">{client.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {client.portfolio?.activeLoans > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {client.portfolio.activeLoans} Loan(s)
                        </span>
                      )}
                      {client.portfolio?.activeInsurancePolicies > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          {client.portfolio.activeInsurancePolicies} Insurance
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      KES {(client.portfolio?.currentOutstanding || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Total: KES {(client.portfolio?.totalAmountBorrowed || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.riskProfile?.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      client.riskProfile?.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {client.riskProfile?.riskLevel?.toUpperCase() || 'MEDIUM'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleRequestPayment(client)}
                      className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-lg transition-colors"
                    >
                      Request Payment
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-lg transition-colors">
                      <Phone className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No clients found
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Insurance Policy Management</h2>
            <div className="text-sm text-gray-500">
              {pendingInsuranceCount} pending • {data.insurancePolicies.filter(p => p.status === 'active').length} active
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.insurancePolicies.map(policy => (
                <tr key={policy._id} className="hover:bg-amber-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{policy.farmer?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{policy.policyType?.replace('_', ' ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{policy.coverageDetails?.insuredItem}</div>
                    <div className="text-xs text-gray-500">KES {policy.coverageDetails?.sumInsured?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">KES {policy.premium?.amount?.toLocaleString()}/year</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      policy.status === 'active' ? 'bg-green-100 text-green-800' :
                      policy.status === 'application' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {policy.status === 'application' ? (
                      <>
                        <button 
                          onClick={() => handleApproveInsurance(policy._id)}
                          className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectInsurance(policy._id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    ) : policy.status === 'active' ? (
                      <button 
                        onClick={() => {
                          const client = data.clients.find(c => c.user?._id === policy.farmer?._id);
                          if (client) handleRequestPayment(client, policy.premium?.amount);
                        }}
                        className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-lg transition-colors"
                      >
                        Collect Premium
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.insurancePolicies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No insurance policies found
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading && activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-amber-500 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-green-800">
                  🌍 AgriPay<span className="text-amber-600">Finance</span>
                </h1>
                <p className="text-xs text-gray-500">Financial Institution Portal</p>
              </div>
              <nav className="ml-10 flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: Home },
                  { id: 'loans', label: 'Loans', icon: FileText },
                  { id: 'clients', label: 'Clients', icon: Users },
                  { id: 'insurance', label: 'Insurance', icon: ShieldCheck }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-500'
                          : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">Financial Institution</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'loans' && 'Loan Applications Review'}
            {activeTab === 'clients' && 'Client Portfolio Management'}
            {activeTab === 'insurance' && 'Insurance Services'}
          </h1>
          <p className="text-gray-600 mt-2">
            {activeTab === 'overview' && 'Monitor your financial portfolio and client activities'}
            {activeTab === 'loans' && 'Review and process new loan applications from farmers'}
            {activeTab === 'clients' && 'Manage active clients and payment collections'}
            {activeTab === 'insurance' && 'Handle insurance policies and premium collections'}
          </p>
        </div>

        {/* Loading State */}
        {loading && activeTab !== 'overview' && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-green-600 mr-3" />
            <span className="text-gray-600">Loading data...</span>
          </div>
        )}

        {/* Dynamic Content */}
        {!loading && (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'loans' && renderLoans()}
            {activeTab === 'clients' && renderClients()}
            {activeTab === 'insurance' && renderInsurance()}
          </>
        )}
      </main>

      {/* REAL Paystack Payment Modal - FIXED SCRIPT LOADING */}
      {showPaystack && selectedItem && (
        <PaystackPayment
          client={selectedItem}
          amount={selectedItem.amount || Math.round((selectedItem.portfolio?.currentOutstanding || 0) * 0.25)}
          productName={`Payment - ${selectedItem.user?.name}`}
          onSuccess={handlePaystackSuccess}
          onClose={() => {
            setShowPaystack(false);
            setSelectedItem(null);
          }}
        />
      )}

      {/* Application Preview Modal */}
      {showPreview && (
        <ApplicationPreview
          application={selectedItem}
          onClose={() => {
            setShowPreview(false);
            setSelectedItem(null);
          }}
          onApprove={handleApproveLoan}
          onReject={handleRejectLoan}
        />
      )}
    </div>
  );
};

export default FinancialDashboard;