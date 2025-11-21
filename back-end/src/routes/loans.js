const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// Risk analysis function
function calculateRiskScore(loan) {
  let score = 50; // Base score

  // Amount-based risk
  if (loan.amount > 50000) score -= 20;
  else if (loan.amount > 25000) score -= 10;
  else if (loan.amount > 10000) score -= 5;

  // Duration-based risk
  if (loan.duration > 24) score -= 15;
  else if (loan.duration > 12) score -= 8;

  return Math.max(0, Math.min(100, score));
}

// Apply for loan
router.post('/apply', async (req, res) => {
  try {
    const loan = new Loan({
      ...req.body,
      status: 'pending'
    });

    await loan.save();
    
    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: loan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to submit loan application',
      error: error.message
    });
  }
});

// Get loans for financial institution
router.get('/institution/:institutionId', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const { institutionId } = req.params;

    const query = { financialInstitutionId: institutionId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const loans = await Loan.find(query)
      .sort({ applicationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Loan.countDocuments(query);

    res.json({
      success: true,
      data: {
        loans,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch loans',
      error: error.message
    });
  }
});

// Get all loans (for testing)
router.get('/', async (req, res) => {
  try {
    const loans = await Loan.find().sort({ applicationDate: -1 });
    
    res.json({
      success: true,
      data: loans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch loans',
      error: error.message
    });
  }
});

// Get single loan
router.get('/:id', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    res.json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch loan',
      error: error.message
    });
  }
});

// Approve loan
router.patch('/:id/approve', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    if (loan.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Loan is not in pending status'
      });
    }

    loan.status = 'approved';
    loan.approvalDate = new Date();
    loan.riskScore = calculateRiskScore(loan);
    loan.generateRepaymentSchedule();

    await loan.save();

    res.json({
      success: true,
      message: 'Loan approved successfully',
      data: loan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to approve loan',
      error: error.message
    });
  }
});

// Reject loan
router.patch('/:id/reject', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    if (loan.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Loan is not in pending status'
      });
    }

    loan.status = 'rejected';
    loan.notes = req.body.notes || '';

    await loan.save();

    res.json({
      success: true,
      message: 'Loan rejected successfully',
      data: loan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to reject loan',
      error: error.message
    });
  }
});

// Disburse loan
router.patch('/:id/disburse', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    if (loan.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Loan must be approved before disbursement'
      });
    }

    loan.status = 'disbursed';
    loan.disbursementDate = new Date();

    await loan.save();

    res.json({
      success: true,
      message: 'Loan disbursed successfully',
      data: loan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to disburse loan',
      error: error.message
    });
  }
});

// Record payment
router.post('/:id/payments', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    const { amount } = req.body;

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    // Find the earliest pending payment
    const pendingPayment = loan.repaymentSchedule
      .find(payment => payment.status === 'pending');

    if (!pendingPayment) {
      return res.status(400).json({
        success: false,
        message: 'No pending payments found'
      });
    }

    if (amount < pendingPayment.amount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount must be at least ${pendingPayment.amount}`
      });
    }

    pendingPayment.status = 'paid';
    pendingPayment.paidDate = new Date();

    // Update loan status if all payments are completed
    const hasPendingPayments = loan.repaymentSchedule.some(p => p.status === 'pending');
    if (!hasPendingPayments) {
      loan.status = 'completed';
    } else if (loan.status === 'disbursed') {
      loan.status = 'active';
    }

    await loan.save();

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: loan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to record payment',
      error: error.message
    });
  }
});

// Get loan statistics
router.get('/stats/institution/:institutionId', async (req, res) => {
  try {
    const { institutionId } = req.params;

    const totalLoans = await Loan.countDocuments({ financialInstitutionId: institutionId });
    const pendingLoans = await Loan.countDocuments({ 
      financialInstitutionId: institutionId,
      status: 'pending'
    });
    const approvedLoans = await Loan.countDocuments({ 
      financialInstitutionId: institutionId,
      status: 'approved'
    });
    const activeLoans = await Loan.countDocuments({ 
      financialInstitutionId: institutionId,
      status: { $in: ['active', 'disbursed'] }
    });

    const totalAmountResult = await Loan.aggregate([
      { $match: { financialInstitutionId: institutionId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalAmount = totalAmountResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalLoans,
        pendingLoans,
        approvedLoans,
        activeLoans,
        totalAmount,
        averageLoanSize: totalLoans > 0 ? totalAmount / totalLoans : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

module.exports = router;
