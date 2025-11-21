const Transaction = require('../models/Transaction');
const Crop = require('../models/Crop');
const mongoose = require('mongoose');
const moment = require('moment');

const reportsController = {
  // Monthly Income Report
  getMonthlyIncome: async (req, res) => {
    try {
      const { year = moment().year(), month } = req.query;
      // FIX: Use req.user._id instead of req.user.id
      const farmerId = req.user._id;

      const startDate = month 
        ? moment(`${year}-${month}`, 'YYYY-MM').startOf('month')
        : moment().startOf('year');
      const endDate = month
        ? moment(`${year}-${month}`, 'YYYY-MM').endOf('month')
        : moment().endOf('year');

      const incomeData = await Transaction.aggregate([
        {
          $match: {
            farmerId: new mongoose.Types.ObjectId(farmerId),
            type: 'income',
            date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: {
              month: { $month: '$date' },
              category: '$category'
            },
            totalAmount: { $sum: '$amount' },
            transactionCount: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.month': 1 }
        }
      ]);

      const monthlySummary = await Transaction.aggregate([
        {
          $match: {
            farmerId: new mongoose.Types.ObjectId(farmerId),
            date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: { $month: '$date' },
            totalIncome: { 
              $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } 
            },
            totalExpenses: { 
              $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } 
            }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);

      res.json({
        success: true,
        data: {
          period: { year, month },
          incomeByCategory: incomeData,
          monthlySummary: monthlySummary,
          totalIncome: monthlySummary.reduce((sum, month) => sum + month.totalIncome, 0),
          totalExpenses: monthlySummary.reduce((sum, month) => sum + month.totalExpenses, 0),
          netProfit: monthlySummary.reduce((sum, month) => sum + month.totalIncome, 0) - monthlySummary.reduce((sum, month) => sum + month.totalExpenses, 0)
        }
      });

    } catch (error) {
      console.error('Monthly income report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate monthly income report',
        error: error.message
      });
    }
  },

  // Expense Analysis
  getExpenseAnalysis: async (req, res) => {
    try {
      const { period = 'last_30_days' } = req.query;
      // FIX: Use req.user._id instead of req.user.id
      const farmerId = req.user._id;

      let startDate;
      switch (period) {
        case 'last_7_days':
          startDate = moment().subtract(7, 'days');
          break;
        case 'last_30_days':
          startDate = moment().subtract(30, 'days');
          break;
        case 'last_90_days':
          startDate = moment().subtract(90, 'days');
          break;
        case 'this_year':
          startDate = moment().startOf('year');
          break;
        default:
          startDate = moment().subtract(30, 'days');
      }

      const expenseAnalysis = await Transaction.aggregate([
        {
          $match: {
            farmerId: new mongoose.Types.ObjectId(farmerId),
            type: 'expense',
            date: { $gte: startDate.toDate() },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: '$category',
            totalAmount: { $sum: '$amount' },
            transactionCount: { $sum: 1 },
            averageAmount: { $avg: '$amount' }
          }
        },
        {
          $sort: { totalAmount: -1 }
        }
      ]);

      const totalExpenses = expenseAnalysis.reduce((sum, category) => sum + category.totalAmount, 0);

      // Add percentage for each category
      const expenseData = expenseAnalysis.map(category => ({
        category: category._id,
        totalAmount: category.totalAmount,
        transactionCount: category.transactionCount,
        averageAmount: Math.round(category.averageAmount || 0),
        percentage: totalExpenses > 0 ? ((category.totalAmount / totalExpenses) * 100).toFixed(1) : 0
      }));

      res.json({
        success: true,
        data: {
          period,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          expenseBreakdown: expenseData,
          totalExpenses,
          insights: generateExpenseInsights(expenseData)
        }
      });

    } catch (error) {
      console.error('Expense analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate expense analysis',
        error: error.message
      });
    }
  },

  // Crop Profitability Report
  getCropProfitability: async (req, res) => {
    try {
      const { crop } = req.query;
      // FIX: Use req.user._id instead of req.user.id
      const farmerId = req.user._id;

      const matchStage = { farmerId: new mongoose.Types.ObjectId(farmerId) };
      if (crop) matchStage.name = crop;

      const cropProfitability = await Crop.aggregate([
        {
          $match: matchStage
        },
        {
          $group: {
            _id: '$name',
            totalCosts: { $sum: '$totalCosts' },
            totalRevenue: { $sum: '$totalRevenue' },
            totalFarmSize: { $sum: '$farmSize' },
            cropCount: { $sum: 1 },
            averageYield: { $avg: '$actualYield' }
          }
        },
        {
          $project: {
            crop: '$_id',
            totalCosts: 1,
            totalRevenue: 1,
            totalProfit: { $subtract: ['$totalRevenue', '$totalCosts'] },
            profitMargin: {
              $cond: [
                { $eq: ['$totalRevenue', 0] },
                0,
                { $multiply: [{ $divide: [{ $subtract: ['$totalRevenue', '$totalCosts'] }, '$totalRevenue'] }, 100] }
              ]
            },
            profitPerAcre: {
              $cond: [
                { $eq: ['$totalFarmSize', 0] },
                0,
                { $divide: [{ $subtract: ['$totalRevenue', '$totalCosts'] }, '$totalFarmSize'] }
              ]
            },
            averageYield: 1,
            cropCount: 1
          }
        },
        {
          $sort: { totalProfit: -1 }
        }
      ]);

      const totalInvestment = cropProfitability.reduce((sum, crop) => sum + crop.totalCosts, 0);
      const totalRevenue = cropProfitability.reduce((sum, crop) => sum + crop.totalRevenue, 0);
      const overallProfit = totalRevenue - totalInvestment;

      res.json({
        success: true,
        data: {
          cropProfitability,
          mostProfitableCrop: cropProfitability[0] || null,
          totalInvestment,
          totalRevenue,
          overallProfit,
          overallProfitMargin: totalRevenue > 0 ? ((overallProfit / totalRevenue) * 100).toFixed(1) : 0
        }
      });

    } catch (error) {
      console.error('Crop profitability error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate crop profitability report',
        error: error.message
      });
    }
  },

  // Annual Financial Summary
  getAnnualSummary: async (req, res) => {
    try {
      const { year = moment().year() } = req.query;
      // FIX: Use req.user._id instead of req.user.id
      const farmerId = req.user._id;

      const startDate = moment(`${year}-01-01`);
      const endDate = moment(`${year}-12-31`);

      // Annual income and expenses
      const annualFinancials = await Transaction.aggregate([
        {
          $match: {
            farmerId: new mongoose.Types.ObjectId(farmerId),
            date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: { $month: '$date' },
            income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
            expenses: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);

      // Fill in missing months with zero values
      const completeAnnualData = [];
      for (let month = 1; month <= 12; month++) {
        const existingMonth = annualFinancials.find(m => m._id === month);
        completeAnnualData.push({
          month,
          income: existingMonth ? existingMonth.income : 0,
          expenses: existingMonth ? existingMonth.expenses : 0,
          profit: existingMonth ? existingMonth.income - existingMonth.expenses : 0
        });
      }

      // Crop performance for the year
      const cropPerformance = await Crop.aggregate([
        {
          $match: {
            farmerId: new mongoose.Types.ObjectId(farmerId),
            plantingDate: { $gte: startDate.toDate(), $lte: endDate.toDate() }
          }
        },
        {
          $group: {
            _id: '$name',
            totalRevenue: { $sum: '$totalRevenue' },
            totalCosts: { $sum: '$totalCosts' },
            totalProfit: { $sum: { $subtract: ['$totalRevenue', '$totalCosts'] } }
          }
        },
        {
          $sort: { totalProfit: -1 }
        }
      ]);

      const totalIncome = completeAnnualData.reduce((sum, month) => sum + month.income, 0);
      const totalExpenses = completeAnnualData.reduce((sum, month) => sum + month.expenses, 0);
      const netProfit = totalIncome - totalExpenses;

      res.json({
        success: true,
        data: {
          year,
          monthlyBreakdown: completeAnnualData,
          cropPerformance,
          summary: {
            totalIncome,
            totalExpenses,
            netProfit,
            profitMargin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0,
            averageMonthlyIncome: Math.round(totalIncome / 12),
            averageMonthlyExpenses: Math.round(totalExpenses / 12),
            averageMonthlyProfit: Math.round(netProfit / 12)
          },
          topPerformingCrop: cropPerformance[0] || null,
          financialHealth: assessFinancialHealth(totalIncome, totalExpenses, netProfit)
        }
      });

    } catch (error) {
      console.error('Annual summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate annual financial summary',
        error: error.message
      });
    }
  },

  // Sales Performance Report
  getSalesPerformance: async (req, res) => {
    try {
      const { period = 'last_30_days' } = req.query;
      // FIX: Use req.user._id instead of req.user.id
      const farmerId = req.user._id;

      let startDate;
      switch (period) {
        case 'last_7_days':
          startDate = moment().subtract(7, 'days');
          break;
        case 'last_30_days':
          startDate = moment().subtract(30, 'days');
          break;
        case 'last_90_days':
          startDate = moment().subtract(90, 'days');
          break;
        case 'this_year':
          startDate = moment().startOf('year');
          break;
        default:
          startDate = moment().subtract(30, 'days');
      }

      const salesPerformance = await Transaction.aggregate([
        {
          $match: {
            farmerId: new mongoose.Types.ObjectId(farmerId),
            type: 'income',
            date: { $gte: startDate.toDate() },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" }
            },
            dailyRevenue: { $sum: '$amount' },
            transactionCount: { $sum: 1 },
            averageTransaction: { $avg: '$amount' }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);

      const totalRevenue = salesPerformance.reduce((sum, day) => sum + day.dailyRevenue, 0);
      const totalTransactions = salesPerformance.reduce((sum, day) => sum + day.transactionCount, 0);

      res.json({
        success: true,
        data: {
          period,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          salesPerformance,
          summary: {
            totalRevenue,
            totalTransactions,
            averageDailyRevenue: totalRevenue / salesPerformance.length,
            averageTransactionValue: totalRevenue / totalTransactions
          },
          bestSellingDay: salesPerformance.reduce((best, day) => 
            day.dailyRevenue > best.dailyRevenue ? day : best, 
            { dailyRevenue: 0 }
          )
        }
      });

    } catch (error) {
      console.error('Sales performance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate sales performance report',
        error: error.message
      });
    }
  }
};

// Helper functions
function generateExpenseInsights(expenseData) {
  const insights = [];
  
  if (expenseData.length === 0) {
    return ['No expense data available for the selected period'];
  }

  const topExpense = expenseData[0];
  
  if (topExpense) {
    insights.push(`Your largest expense category is ${topExpense.category} (${topExpense.percentage}% of total expenses)`);
  }
  
  const fertilizerExpense = expenseData.find(e => e.category === 'fertilizer');
  if (fertilizerExpense && fertilizerExpense.percentage > 20) {
    insights.push('Consider optimizing fertilizer usage to reduce costs');
  }

  const laborExpense = expenseData.find(e => e.category === 'labor');
  if (laborExpense && laborExpense.percentage > 30) {
    insights.push('Labor costs are high - consider efficiency improvements');
  }

  if (expenseData.length > 3) {
    insights.push(`You have ${expenseData.length} major expense categories - consider consolidation`);
  }

  return insights;
}

function assessFinancialHealth(income, expenses, netProfit) {
  if (income === 0) return 'no_data';
  if (netProfit > income * 0.3) return 'excellent';
  if (netProfit > income * 0.15) return 'good';
  if (netProfit > 0) return 'stable';
  if (netProfit > -income * 0.1) return 'needs_improvement';
  return 'critical';
}

module.exports = reportsController;