const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// 🚀 FIXED: Direct login WITHOUT timeout conflict
router.post('/login', async (req, res) => {
  console.log('?? DIRECT LOGIN HANDLER - FARMER ATTEMPT');
  
  try {
    console.log('📧 Login request body:', { 
      email: req.body.email, 
      role: 'farmer',
      hasPassword: !!req.body.password 
    });
    
    await authController.login(req, res);
    
    console.log('✅ LOGIN HANDLER COMPLETED SUCCESSFULLY');
    
  } catch (error) {
    console.error('💥 LOGIN HANDLER ERROR:', error);
    
    // Only send response if not already sent
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        message: 'Login failed due to server error' 
      });
    }
  }
});

// Public routes
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;