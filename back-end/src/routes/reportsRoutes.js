const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

const reportsController = {
  getMonthlyIncome: async (req, res) => {
    try {
      const mockData = {
        period: { year: 2024, month: 11 },
        incomeByCategory: [
          { _id: { month: 11, category: 'crop_sale' }, totalAmount: 45000, transactionCount: 3 },
          { _id: { month: 11, category: 'livestock_sale' }, totalAmount: 12000, transactionCount: 1 }
        ],
        monthlySummary: [
          { _id: 11, totalIncome: 57000, totalExpenses: 18000 }
        ],
        totalIncome: 57000,
        totalExpenses: 18000
      };

      res.json({
        success: true,
        data: mockData
      });
    } catch (error) {
      console.error('Monthly income report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate monthly income report'
      });
    }
  },

  getExpenseAnalysis: async (req, res) => {
    try {
      const mockData = {
        period: 'last_30_days',
        expenseBreakdown: [
          { _id: 'seeds', totalAmount: 5000, percentage: '27.8' },
          { _id: 'fertilizer', totalAmount: 4500, percentage: '25.0' },
          { _id: 'labor', totalAmount: 4000, percentage: '22.2' }
        ],
        totalExpenses: 18000
      };

      res.json({
        success: true,
        data: mockData
      });
    } catch (error) {
      console.error('Expense analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate expense analysis'
      });
    }
  },

  getCropProfitability: async (req, res) => {
    try {
      const mockData = {
        cropProfitability: [
          {
            crop: 'maize',
            totalCosts: 15000,
            totalRevenue: 35000,
            totalProfit: 20000,
            profitMargin: 57.1
          }
        ]
      };

      res.json({
        success: true,
        data: mockData
      });
    } catch (error) {
      console.error('Crop profitability error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate crop profitability report'
      });
    }
  },

  getAnnualSummary: async (req, res) => {
    try {
      const mockData = {
        year: 2024,
        summary: {
          totalIncome: 656000,
          totalExpenses: 226000,
          netProfit: 430000,
          profitMargin: 65.5
        }
      };

      res.json({
        success: true,
        data: mockData
      });
    } catch (error) {
      console.error('Annual summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate annual financial summary'
      });
    }
  }
};

router.use(authenticate);
router.get('/monthly-income', reportsController.getMonthlyIncome);
router.get('/expense-analysis', reportsController.getExpenseAnalysis);
router.get('/crop-profitability', reportsController.getCropProfitability);
router.get('/annual-summary', reportsController.getAnnualSummary);

module.exports = router;
