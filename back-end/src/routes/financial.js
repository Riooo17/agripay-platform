// routes/financial.js - COMPLETE WORKING VERSION
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Mock data for Financial Dashboard
const mockFinancialData = {
  stats: {
    totalPortfolioValue: 12500000,
    totalOutstanding: 4850000,
    pendingApplications: 8,
    activePolicies: 15,
    activeClients: 24,
    monthlyRevenue: 450000,
    riskDistribution: {
      low: 45,
      medium: 35,
      high: 20
    }
  },
  loanApplications: [
    {
      _id: '1',
      applicationId: 'APP001',
      farmer: {
        _id: 'f1',
        name: 'John Kamau',
        phone: '254712345678',
        email: 'john@agripay.com'
      },
      farmDetails: {
        size: { value: 5, unit: 'acres' },
        mainCrop: 'Maize',
        location: { county: 'Nakuru', subCounty: 'Naivasha' }
      },
      loanDetails: {
        requestedAmount: 50000,
        purpose: 'seeds_fertilizers',
        purposeDescription: 'Purchase of seeds and fertilizers for maize planting',
        repaymentPeriod: { value: 12, unit: 'months' }
      },
      riskAssessment: {
        creditScore: 78,
        riskLevel: 'low'
      },
      status: 'submitted',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      applicationId: 'APP002',
      farmer: {
        _id: 'f2',
        name: 'Mary Wanjiku',
        phone: '254723456789',
        email: 'mary@agripay.com'
      },
      farmDetails: {
        size: { value: 8, unit: 'acres' },
        mainCrop: 'Coffee',
        location: { county: 'Kiambu', subCounty: 'Limuru' }
      },
      loanDetails: {
        requestedAmount: 120000,
        purpose: 'equipment_purchase',
        purposeDescription: 'Purchase of coffee processing equipment',
        repaymentPeriod: { value: 18, unit: 'months' }
      },
      riskAssessment: {
        creditScore: 65,
        riskLevel: 'medium'
      },
      status: 'submitted',
      createdAt: '2024-01-14T14:20:00Z'
    }
  ],
  clients: [
    {
      _id: 'c1',
      user: {
        _id: 'u1',
        name: 'Michael Njoroge',
        phone: '254790123456',
        email: 'michael@agripay.com',
        location: 'Embu'
      },
      portfolio: {
        totalLoansTaken: 3,
        activeLoans: 1,
        totalInsurancePolicies: 2,
        activeInsurancePolicies: 2,
        totalAmountBorrowed: 450000,
        totalAmountRepaid: 165000,
        currentOutstanding: 285000
      },
      riskProfile: {
        creditScore: 85,
        riskLevel: 'low'
      },
      relationship: {
        startDate: '2023-11-15T00:00:00Z',
        status: 'active'
      }
    },
    {
      _id: 'c2',
      user: {
        _id: 'u2',
        name: 'Esther Muthoni',
        phone: '254701234567',
        email: 'esther@agripay.com',
        location: 'Meru'
      },
      portfolio: {
        totalLoansTaken: 2,
        activeLoans: 1,
        totalInsurancePolicies: 1,
        activeInsurancePolicies: 1,
        totalAmountBorrowed: 280000,
        totalAmountRepaid: 85000,
        currentOutstanding: 195000
      },
      riskProfile: {
        creditScore: 78,
        riskLevel: 'low'
      },
      relationship: {
        startDate: '2023-12-01T00:00:00Z',
        status: 'active'
      }
    }
  ],
  insurancePolicies: [
    {
      _id: 'i1',
      policyNumber: 'POL001',
      farmer: {
        _id: 'u1',
        name: 'Michael Njoroge'
      },
      policyType: 'crop_insurance',
      coverageDetails: {
        insuredItem: 'Maize - 10 acres',
        sumInsured: 500000
      },
      premium: {
        amount: 12000
      },
      status: 'active'
    },
    {
      _id: 'i2',
      policyNumber: 'POL002',
      farmer: {
        _id: 'u1',
        name: 'Michael Njoroge'
      },
      policyType: 'equipment_insurance',
      coverageDetails: {
        insuredItem: 'Tractor & Implements',
        sumInsured: 300000
      },
      premium: {
        amount: 8000
      },
      status: 'active'
    },
    {
      _id: 'i3',
      policyNumber: 'POL003',
      farmer: {
        _id: 'u2',
        name: 'Esther Muthoni'
      },
      policyType: 'livestock_insurance',
      coverageDetails: {
        insuredItem: 'Dairy Cows - 15 heads',
        sumInsured: 750000
      },
      premium: {
        amount: 15000
      },
      status: 'pending'
    }
  ]
};

// @desc    Get dashboard statistics
// @route   GET /api/financial/dashboard
// @access  Private
router.get('/dashboard', authenticate, (req, res) => {
  try {
    console.log('📊 Financial Dashboard Stats Request');
    res.json({
      success: true,
      data: mockFinancialData.stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// @desc    Get loan applications
// @route   GET /api/financial/loan-applications
// @access  Private
router.get('/loan-applications', authenticate, (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    console.log('📋 Loan Applications Request - Status:', status);
    
    let applications = mockFinancialData.loanApplications;
    
    if (status) {
      applications = applications.filter(app => app.status === status);
    }
    
    res.json({
      success: true,
      data: {
        applications: applications,
        pagination: {
          page: 1,
          limit: 10,
          total: applications.length,
          pages: 1
        }
      }
    });
  } catch (error) {
    console.error('Loan applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch loan applications'
    });
  }
});

// @desc    Get clients
// @route   GET /api/financial/clients
// @access  Private
router.get('/clients', authenticate, (req, res) => {
  try {
    console.log('👥 Clients Request');
    res.json({
      success: true,
      data: {
        clients: mockFinancialData.clients,
        pagination: {
          page: 1,
          limit: 10,
          total: mockFinancialData.clients.length,
          pages: 1
        }
      }
    });
  } catch (error) {
    console.error('Clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clients'
    });
  }
});

// @desc    Get insurance policies
// @route   GET /api/financial/insurance-policies
// @access  Private
router.get('/insurance-policies', authenticate, (req, res) => {
  try {
    const { status } = req.query;
    console.log('🛡️ Insurance Policies Request - Status:', status);
    
    let policies = mockFinancialData.insurancePolicies;
    
    if (status) {
      policies = policies.filter(policy => policy.status === status);
    }
    
    res.json({
      success: true,
      data: {
        policies: policies,
        pagination: {
          page: 1,
          limit: 10,
          total: policies.length,
          pages: 1
        }
      }
    });
  } catch (error) {
    console.error('Insurance policies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch insurance policies'
    });
  }
});

// @desc    Approve loan application
// @route   POST /api/financial/loan-applications/:id/approve
// @access  Private
router.post('/loan-applications/:id/approve', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    console.log('✅ Approving Loan Application:', id);
    
    res.json({
      success: true,
      data: { message: 'Loan application approved successfully' },
      message: 'Loan application approved successfully'
    });
  } catch (error) {
    console.error('Approve loan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve loan application'
    });
  }
});

// @desc    Reject loan application
// @route   POST /api/financial/loan-applications/:id/reject
// @access  Private
router.post('/loan-applications/:id/reject', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    console.log('❌ Rejecting Loan Application:', id);
    
    res.json({
      success: true,
      data: { message: 'Loan application rejected' },
      message: 'Loan application rejected'
    });
  } catch (error) {
    console.error('Reject loan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject loan application'
    });
  }
});

// @desc    Approve insurance policy
// @route   POST /api/financial/insurance-policies/:id/approve
// @access  Private
router.post('/insurance-policies/:id/approve', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    console.log('✅ Approving Insurance Policy:', id);
    
    res.json({
      success: true,
      data: { message: 'Insurance policy approved successfully' },
      message: 'Insurance policy approved successfully'
    });
  } catch (error) {
    console.error('Approve insurance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve insurance policy'
    });
  }
});

// @desc    Reject insurance policy
// @route   POST /api/financial/insurance-policies/:id/reject
// @access  Private
router.post('/insurance-policies/:id/reject', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    console.log('❌ Rejecting Insurance Policy:', id);
    
    res.json({
      success: true,
      data: { message: 'Insurance policy rejected' },
      message: 'Insurance policy rejected'
    });
  } catch (error) {
    console.error('Reject insurance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject insurance policy'
    });
  }
});

// @desc    Request payment
// @route   POST /api/financial/clients/:id/request-payment
// @access  Private
router.post('/clients/:id/request-payment', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;
    console.log('💰 Requesting Payment:', { clientId: id, amount, description });
    
    res.json({
      success: true,
      data: { 
        message: 'Payment request sent successfully',
        paymentReference: 'PAY_' + Date.now()
      },
      message: 'Payment request sent successfully'
    });
  } catch (error) {
    console.error('Request payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send payment request'
    });
  }
});

module.exports = router;