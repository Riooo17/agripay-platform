const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const mpesaService = require('./services/mpesaService');

const app = express();

// Middleware - FIXED CORS FOR PRODUCTION FRONTEND
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173',
    'https://agripayafrica.netlify.app',  // YOUR DEPLOYED FRONTEND
    'https://agripay-platform.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// MongoDB Connection with debugging
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      console.log('🔄 Attempting MongoDB connection...');
      console.log('📝 Connection string:', process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://USER:PASSWORD@'));
      
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log('✅ MongoDB Connected');
      console.log('📊 Database:', mongoose.connection.db.databaseName);
    } else {
      console.log('❌ MONGODB_URI not set');
    }
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('🔍 Error name:', error.name);
    console.log('🔍 Error code:', error.code);
    console.log('🔍 Full error details:', JSON.stringify(error, null, 2));
  }
};

connectDB();

// =============================================
// ✅ IMPORT ALL MODELS
// =============================================
require('./models/User');
require('./models/Farmer');
require('./models/Product');
require('./models/Order');
require('./models/Wishlist');
require('./models/Review');
// Add Financial Models
require('./models/FinancialInstitution');
require('./models/LoanApplication');
require('./models/Loan');
require('./models/InsurancePolicy');
require('./models/Payment');
require('./models/Client');
console.log('✅ All models registered successfully');

// =============================================
// ✅ MAIN API ROUTES FIRST (FIXED ORDER!)
// =============================================
const routes = require('./routes');
app.use('/api', routes);

// =============================================
// ✅ AUTH ROUTES
// =============================================
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// =============================================
// ✅ FINANCIAL ROUTES
// =============================================
const financialRoutes = require('./routes/financial');
app.use('/api/financial', financialRoutes);

// =============================================
// ✅ MPESA ROUTES AFTER MAIN ROUTES
// =============================================

// REAL M-Pesa STK Push
app.post('/api/mpesa/stk-push', async (req, res) => {
  try {
    const { phoneNumber, amount, accountReference, description } = req.body;

    if (!phoneNumber || !amount || !accountReference) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: phoneNumber, amount, accountReference'
      });
    }

    const result = await mpesaService.stkPush(phoneNumber, amount, accountReference, description);

    if (result.success) {
      res.json({
        success: true,
        message: 'M-Pesa payment initiated successfully',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to initiate M-Pesa payment',
        error: result.error
      });
    }

  } catch (error) {
    console.error('STK Push error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment initiation',
      error: error.message
    });
  }
});

// M-Pesa callback handler
app.post('/api/mpesa/callback', (req, res) => {
  try {
    console.log('📞 M-Pesa Callback Received:', JSON.stringify(req.body, null, 2));
    
    const callbackData = req.body;
    
    if (callbackData.Body && callbackData.Body.stkCallback) {
      const stkCallback = callbackData.Body.stkCallback;
      const resultCode = stkCallback.ResultCode;
      
      console.log(`💰 Payment Result: Code ${resultCode} - ${stkCallback.ResultDesc}`);
      
      if (resultCode === 0) {
        console.log('✅ Payment successful!');
      }
    }
    
    res.json({ 
      ResultCode: 0, 
      ResultDesc: 'Success' 
    });
  } catch (error) {
    console.error('Callback error:', error);
    res.json({ 
      ResultCode: 0, 
      ResultDesc: 'Success' 
    });
  }
});

// Other M-Pesa routes (keep them as is)...
app.get('/api/mpesa/status', (req, res) => {
  res.json({
    success: true,
    message: 'M-Pesa service is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/mpesa/validate-phone', (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Simple phone validation for Kenya
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    const isValid = /^(254|0)[17]\d{8}$/.test(cleanedPhone);
    
    res.json({
      success: true,
      data: {
        isValid,
        formatted: isValid ? `254${cleanedPhone.slice(-9)}` : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Validation error',
      error: error.message
    });
  }
});

app.get('/api/mpesa/test-connection', async (req, res) => {
  try {
    const result = await mpesaService.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Connection test failed',
      error: error.message
    });
  }
});

app.post('/api/mpesa/test-payment', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required for test payment'
      });
    }

    const result = await mpesaService.stkPush(phoneNumber, 1, 'TEST', 'Test Payment');
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Test payment initiated',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Test payment failed',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test payment error',
      error: error.message
    });
  }
});

// =============================================
// HEALTH CHECK ENDPOINT
// =============================================
app.get('/api/health', (req, res) => {
  // Check MongoDB connection status
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  
  res.json({
    success: true,
    message: 'AgriPay API Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    version: '1.0.0'
  });
});

// =============================================
// 404 handler
// =============================================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});

// =============================================
// Error handler
// =============================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

module.exports = app;