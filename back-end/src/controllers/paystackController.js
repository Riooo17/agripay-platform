// controllers/paystackController.js - UPDATED VERSION
const axios = require('axios');
const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');

// Paystack secret key from environment
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const paystackController = {
  // Test Paystack connection
  testConnection: async (req, res) => {
    try {
      if (!PAYSTACK_SECRET_KEY) {
        return res.status(500).json({
          success: false,
          message: 'Paystack secret key not configured'
        });
      }

      // Test Paystack API connection
      const response = await axios.get('https://api.paystack.co/bank', {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      res.json({
        success: true,
        message: '✅ Paystack connection successful',
        data: {
          status: 'Connected',
          mode: 'LIVE',
          banksAvailable: response.data.data ? response.data.data.length : 0,
          paystackResponse: response.data
        }
      });

    } catch (error) {
      console.error('Paystack connection test error:', error.response?.data || error.message);
      
      res.status(500).json({
        success: false,
        message: '❌ Paystack connection failed',
        error: error.response?.data?.message || error.message,
        details: 'Check your Paystack secret key and internet connection'
      });
    }
  },

  // Initialize Paystack payment - FIXED VERSION
  initializePayment: async (req, res) => {
    try {
      const { email, amount, reference, metadata } = req.body;

      console.log('📧 Paystack initialization request:', { email, amount, reference, metadata });

      // Validate required fields
      if (!email || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Email and amount are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Validate amount
      const paymentAmount = parseFloat(amount);
      if (paymentAmount < 100 || paymentAmount > 10000000) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be between KES 100 and KES 10,000,000'
        });
      }

      // Convert amount to kobo
      const amountInKobo = Math.round(paymentAmount * 100);

      // Generate reference if not provided
      const paymentReference = reference || `AGRIPAY_${Date.now()}_${uuidv4().substring(0, 8)}`;

      // Prepare metadata properly - FIXED
      let paystackMetadata = {
        custom_fields: []
      };
      
      // Add default metadata
      paystackMetadata.custom_fields.push(
        {
          display_name: "Payment Type",
          variable_name: "payment_type",
          value: "Agricultural Payment"
        },
        {
          display_name: "Platform",
          variable_name: "platform", 
          value: "AgriPay Africa"
        },
        {
          display_name: "Customer Email",
          variable_name: "customer_email",
          value: email
        }
      );

      // Add custom metadata if provided
      if (metadata && typeof metadata === 'object') {
        Object.entries(metadata).forEach(([key, value]) => {
          paystackMetadata.custom_fields.push({
            display_name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            variable_name: key,
            value: value?.toString() || ''
          });
        });
      }

      // Prepare Paystack request payload
      const paystackPayload = {
        email: email,
        amount: amountInKobo,
        reference: paymentReference,
        currency: 'KES',
        channels: ['card', 'bank', 'ussd', 'mobile_money'],
        metadata: paystackMetadata,
        callback_url: `${process.env.SERVER_URL}/api/paystack/verify/${paymentReference}`
      };

      console.log('🚀 Sending Paystack request:', JSON.stringify(paystackPayload, null, 2));

      // Make request to Paystack
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        paystackPayload,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Paystack response:', response.data);

      if (response.data.status === true) {
        // ✅ FIXED: Create payment record with correct enum values
        const payment = new Payment({
          amount: paymentAmount,
          paymentMethod: 'paystack', // ✅ CORRECT ENUM VALUE
          paymentGateway: 'paystack',
          payerId: req.user?._id || null, // ✅ MADE OPTIONAL
          gatewayReference: paymentReference,
          status: 'pending',
          description: metadata?.product_name || 'Agricultural Products Payment',
          metadata: {
            email: email,
            paystackResponse: response.data.data,
            authorization_url: response.data.data.authorization_url,
            access_code: response.data.data.access_code,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            customMetadata: metadata || {}
          }
        });

        await payment.save();
        console.log('✅ Payment record created successfully:', payment._id);

        res.json({
          success: true,
          message: 'Payment initialized successfully',
          data: {
            authorization_url: response.data.data.authorization_url,
            access_code: response.data.data.access_code,
            reference: paymentReference,
            amount: paymentAmount,
            email: email,
            paymentId: payment._id
          }
        });
      } else {
        throw new Error(response.data.message || 'Failed to initialize payment');
      }

    } catch (error) {
      console.error('❌ Paystack initialization error:', error);
      
      // More detailed error information
      if (error.name === 'ValidationError') {
        console.error('Mongoose Validation Error Details:', error.errors);
      }

      res.status(500).json({
        success: false,
        message: 'Failed to initialize Paystack payment',
        error: error.message,
        details: error.errors || 'Check your payment configuration'
      });
    }
  },

  // Verify Paystack payment
  verifyPayment: async (req, res) => {
    try {
      const { reference } = req.params;

      if (!reference) {
        return res.status(400).json({
          success: false,
          message: 'Payment reference is required'
        });
      }

      console.log('🔍 Verifying Paystack payment:', reference);

      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Paystack verification response:', response.data);

      if (response.data.status === true) {
        const transaction = response.data.data;

        // Find and update payment record
        const payment = await Payment.findOne({ gatewayReference: reference });
        if (payment) {
          payment.status = transaction.status === 'success' ? 'completed' : 'failed';
          payment.processedAt = new Date();
          payment.metadata.verificationResponse = transaction;
          payment.metadata.paidAt = transaction.paid_at;
          
          await payment.save();

          console.log('✅ Payment status updated:', payment.status);

          // Emit real-time notification if payment completed
          const io = req.app.get('io');
          if (io && payment.status === 'completed' && payment.payerId) {
            io.to(payment.payerId.toString()).emit('paymentCompleted', {
              paymentId: payment._id,
              amount: payment.amount,
              gateway: 'paystack',
              timestamp: new Date()
            });
          }
        }

        res.json({
          success: true,
          message: 'Payment verification successful',
          data: {
            status: transaction.status,
            amount: transaction.amount / 100,
            currency: transaction.currency,
            paidAt: transaction.paid_at,
            reference: transaction.reference,
            gateway_response: transaction.gateway_response
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Payment verification failed',
          error: response.data.message
        });
      }

    } catch (error) {
      console.error('❌ Paystack verification error:', error.response?.data || error.message);
      
      res.status(500).json({
        success: false,
        message: 'Failed to verify payment',
        error: error.response?.data?.message || error.message
      });
    }
  },

  // Paystack webhook handler
  webhook: async (req, res) => {
    try {
      const signature = req.headers['x-paystack-signature'];
      const body = req.body;

      console.log('📨 Paystack webhook received:', {
        signature: signature ? 'Present' : 'Missing',
        event: body.event,
        reference: body.data?.reference
      });

      if (body.event === 'charge.success') {
        const transaction = body.data;
        
        // Find and update payment record
        const payment = await Payment.findOne({ gatewayReference: transaction.reference });
        if (payment) {
          payment.status = 'completed';
          payment.processedAt = new Date();
          payment.metadata.webhookData = transaction;
          payment.metadata.paidAt = transaction.paid_at;
          
          await payment.save();

          console.log('✅ Webhook: Payment marked as completed:', transaction.reference);

          // Emit real-time notification
          const io = req.app.get('io');
          if (io && payment.payerId) {
            io.to(payment.payerId.toString()).emit('paymentCompleted', {
              paymentId: payment._id,
              amount: payment.amount,
              gateway: 'paystack',
              timestamp: new Date(),
              via: 'webhook'
            });
          }
        } else {
          console.warn('⚠️ Webhook: Payment not found for reference:', transaction.reference);
        }
      }

      res.status(200).json({ received: true });

    } catch (error) {
      console.error('❌ Paystack webhook error:', error);
      res.status(200).json({ received: true, error: error.message });
    }
  },

  // Get supported banks
  getBanks: async (req, res) => {
    try {
      const response = await axios.get('https://api.paystack.co/bank', {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      res.json({
        success: true,
        data: response.data.data
      });

    } catch (error) {
      console.error('Get banks error:', error.response?.data || error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch banks',
        error: error.response?.data?.message || error.message
      });
    }
  },

  // Resolve bank account
  resolveAccount: async (req, res) => {
    try {
      const { account_number, bank_code } = req.body;

      if (!account_number || !bank_code) {
        return res.status(400).json({
          success: false,
          message: 'Account number and bank code are required'
        });
      }

      const response = await axios.get(
        `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      res.json({
        success: true,
        data: response.data.data
      });

    } catch (error) {
      console.error('Resolve account error:', error.response?.data || error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to resolve account',
        error: error.response?.data?.message || error.message
      });
    }
  }
};

module.exports = paystackController;