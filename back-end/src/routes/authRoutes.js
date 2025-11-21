const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes'
  }
});

// Input validation
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const registerValidation = [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['farmer', 'buyer', 'input-seller', 'logistics', 'financial'])
];

// 🚀 FIXED: Login with validation and rate limiting
router.post('/login', loginLimiter, loginValidation, async (req, res) => {
  console.log('🔐 LOGIN ATTEMPT:', { 
    email: req.body.email, 
    role: req.body.role || 'farmer'
  });
  
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    await authController.login(req, res);
    
  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        message: 'Login failed due to server error' 
      });
    }
  }
});

// Fixed register route with validation
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    await authController.register(req, res);
    
  } catch (error) {
    console.error('💥 REGISTER ERROR:', error);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        message: 'Registration failed due to server error' 
      });
    }
  }
});

// Additional routes
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;