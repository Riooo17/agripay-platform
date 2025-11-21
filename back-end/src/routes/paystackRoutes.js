// routes/paystackRoutes.js
const express = require('express');
const router = express.Router();
const paystackController = require('../controllers/paystackController');
const { authenticate } = require('../middleware/auth');

// Paystack-specific routes
router.get('/test', authenticate, paystackController.testConnection);
router.post('/initialize', authenticate, paystackController.initializePayment);
router.get('/verify/:reference', authenticate, paystackController.verifyPayment);
router.post('/webhook', paystackController.webhook); // No auth for webhooks
router.get('/banks', authenticate, paystackController.getBanks);
router.post('/resolve-account', authenticate, paystackController.resolveAccount);

module.exports = router;