const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');
const { authenticate } = require('../middleware/auth');

// All routes are protected and require expert role
router.use(authenticate);


// Dashboard routes
router.get('/dashboard', expertController.getDashboard);
router.get('/analytics', expertController.getAnalytics);

// Consultation routes
router.get('/consultations', expertController.getConsultations);
router.put('/consultations/:id', expertController.updateConsultation);
router.post('/advice', expertController.provideAdvice);

// Availability routes
router.post('/availability', expertController.setAvailability);

// Client routes
router.get('/clients', expertController.getClients);

// Knowledge content routes
router.get('/knowledge', expertController.getKnowledgeContent);
router.post('/knowledge', expertController.createKnowledgeContent);
router.put('/knowledge/:id', expertController.updateKnowledgeContent);

module.exports = router;
