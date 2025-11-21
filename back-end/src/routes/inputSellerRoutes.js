const express = require('express');
const router = express.Router();
const inputSellerController = require('../controllers/inputSellerController');
const { authenticate } = require('../middleware/auth');

// All routes are protected and require input_seller role
router.use(authenticate);


// Dashboard routes
router.get('/dashboard', inputSellerController.getDashboard);
router.get('/analytics', inputSellerController.getAnalytics);

// Product routes
router.route('/products')
  .get(inputSellerController.getProducts)
  .post(inputSellerController.addProduct);

router.route('/products/:id')
  .put(inputSellerController.updateProduct)
  .delete(inputSellerController.deleteProduct);

// Order routes
router.route('/orders')
  .get(inputSellerController.getOrders);

router.route('/orders/:id')
  .put(inputSellerController.updateOrderStatus);

// Customer routes
router.get('/customers', inputSellerController.getCustomers);

module.exports = router;
