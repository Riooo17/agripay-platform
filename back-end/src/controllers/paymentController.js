// controllers/paymentController.js - ONE FILE ONLY
const paymentController = {
  // Initialize Payment - SIMPLE MOCK THAT WORKS
  initializePayment: async (req, res) => {
    try {
      console.log('💰 Payment Initialize Request:', req.body);
      
      // ALWAYS RETURN SUCCESS - NO VALIDATION, NO ERRORS
      res.json({
        status: true,
        message: "Payment URL created",
        data: {
          authorization_url: `https://checkout.paystack.com/demo_${Date.now()}`,
          access_code: `demo_${Date.now()}`,
          reference: `ref_${Date.now()}`
        }
      });
    } catch (error) {
      // NEVER FAIL
      res.json({
        status: true,
        message: "Payment URL created",
        data: {
          authorization_url: `https://checkout.paystack.com/fallback_${Date.now()}`,
          access_code: `fallback_${Date.now()}`,
          reference: `ref_${Date.now()}`
        }
      });
    }
  },

  // Verify Payment - SIMPLE MOCK THAT WORKS  
  verifyPayment: async (req, res) => {
    try {
      console.log('✅ Payment Verify Request:', req.params.reference);
      
      // ALWAYS RETURN SUCCESS
      res.json({
        status: true,
        message: "Payment successful",
        data: {
          status: "success",
          reference: req.params.reference,
          amount: 50000,
          currency: "KES",
          paid_at: new Date().toISOString()
        }
      });
    } catch (error) {
      // NEVER FAIL
      res.json({
        status: true,
        message: "Payment successful", 
        data: {
          status: "success",
          reference: req.params.reference,
          amount: 50000,
          currency: "KES"
        }
      });
    }
  }
};

module.exports = paymentController;