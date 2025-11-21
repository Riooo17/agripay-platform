const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');
const { authenticate } = require('../middleware/auth');

// All routes are protected and require logistics role
router.use(authenticate);


// Dashboard routes
router.get('/dashboard', logisticsController.getDashboard);
router.get('/predictive-routes', logisticsController.getPredictiveRoutes);
router.get('/cold-chain', logisticsController.getColdChainMonitoring);

// Delivery routes
router.get('/deliveries', logisticsController.getDeliveries);
router.put('/deliveries/:id', logisticsController.updateDeliveryStatus);

// Vehicle routes
router.get('/vehicles', logisticsController.getVehicles);

// Quote routes
router.post('/quote', logisticsController.generateQuote);

module.exports = router;
