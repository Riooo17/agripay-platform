// src/routes/mpesaRoutes.js
const express = require('express');
const router = express.Router();
const mpesaController = require('../controllers/mpesaController');

// M-Pesa Routes
router.post('/stk-push', mpesaController.initiateSTKPush);
router.post('/callback', mpesaController.handleCallback);
router.post('/status', mpesaController.checkTransactionStatus);
router.get('/test-config', mpesaController.testMpesaConfig);

// Remove these if not in controller anymore
// router.post('/validate-phone', mpesaController.validatePhoneNumber);
// router.get('/test-connection', mpesaController.testConnection);

module.exports = router;
