const express = require('express');
const router = express.Router();

console.log('✅ Financial routes loaded successfully');

// Demo dashboard endpoint
router.get('/dashboard', (req, res) => {
  console.log('📊 Financial dashboard called');
  res.json({
    success: true,
    message: 'Financial dashboard working!',
    data: {
      loanApplications: [
        {
          id: 'loan_1',
          name: 'John Kamau',
          amount: 75000,
          status: 'pending',
          crop: 'Maize'
        }
      ],
      activeClients: [
        {
          id: 'client_1', 
          name: 'Sarah Mwende',
          outstanding: 45000,
          nextPayment: '2024-02-20'
        }
      ],
      insurancePolicies: [
        {
          id: 'ins_1',
          client: 'John Kamau', 
          type: 'Crop Insurance',
          status: 'pending'
        }
      ],
      dashboardStats: {
        totalPortfolio: 450000,
        totalOutstanding: 165000,
        activeClientsCount: 2,
        pendingApplications: 3
      }
    }
  });
});

// Other endpoints
router.get('/loan-applications', (req, res) => {
  res.json({ success: true, data: [] });
});

router.get('/active-clients', (req, res) => {
  res.json({ success: true, data: [] });
});

router.get('/insurance-policies', (req, res) => {
  res.json({ success: true, data: [] });
});

module.exports = router;
