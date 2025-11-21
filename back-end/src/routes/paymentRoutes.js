// routes/paymentRoutes.js - ONE FILE ONLY
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// ONLY 2 ROUTES - NO COMPLEXITY
router.post('/initialize', authenticate, paymentController.initializePayment);
router.get('/verify/:reference', authenticate, paymentController.verifyPayment);

module.exports = router;