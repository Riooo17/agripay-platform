// src/controllers/mpesaController.js
const axios = require('axios');
const moment = require('moment');

// M-Pesa credentials from your environment variables
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;
const MPESA_BASE_URL = process.env.MPESA_BASE_URL;

// Get M-Pesa access token
const getAccessToken = async () => {
  try {
    console.log('🔑 Getting M-Pesa access token...');
    
    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
      throw new Error('M-Pesa credentials missing');
    }

    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        'Authorization': `Basic ${auth}`
      },
      timeout: 10000 // 10 second timeout
    });
    
    console.log('✅ Access token received');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error getting access token:', error.message);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to M-Pesa server');
    }
    if (error.response?.status === 401) {
      throw new Error('Invalid M-Pesa credentials');
    }
    throw new Error('Failed to get M-Pesa access token: ' + error.message);
  }
};

// Test endpoint to check M-Pesa configuration
const testMpesaConfig = async (req, res) => {
  try {
    console.log('🔧 Testing M-Pesa configuration...');
    
    // Check if environment variables are set
    const config = {
      consumerKey: MPESA_CONSUMER_KEY ? '✅ Set' : '❌ Missing',
      consumerSecret: MPESA_CONSUMER_SECRET ? '✅ Set' : '❌ Missing',
      passkey: MPESA_PASSKEY ? '✅ Set' : '❌ Missing',
      shortcode: MPESA_SHORTCODE ? '✅ Set' : '❌ Missing',
      callbackUrl: MPESA_CALLBACK_URL ? '✅ Set' : '❌ Missing',
      baseUrl: MPESA_BASE_URL ? '✅ Set' : '❌ Missing'
    };

    console.log('M-Pesa Configuration:', config);

    // Check if any credentials are missing
    const missingCredentials = Object.values(config).some(status => status.includes('Missing'));
    if (missingCredentials) {
      return res.status(400).json({
        success: false,
        message: 'M-Pesa configuration incomplete',
        config: config,
        error: 'Some M-Pesa credentials are missing from environment variables'
      });
    }

    // Try to get access token
    console.log('🔄 Testing M-Pesa connection...');
    const accessToken = await getAccessToken();
    
    console.log('✅ M-Pesa configuration test passed');
    res.json({
      success: true,
      message: 'M-Pesa configuration is correct and working',
      config: config,
      accessToken: accessToken ? '✅ Valid' : '❌ Invalid',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ M-Pesa configuration test failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'M-Pesa configuration test failed: ' + error.message,
      config: {
        consumerKey: MPESA_CONSUMER_KEY ? '✅ Set' : '❌ Missing',
        consumerSecret: MPESA_CONSUMER_SECRET ? '✅ Set' : '❌ Missing',
        passkey: MPESA_PASSKEY ? '✅ Set' : '❌ Missing',
        shortcode: MPESA_SHORTCODE ? '✅ Set' : '❌ Missing',
        callbackUrl: MPESA_CALLBACK_URL ? '✅ Set' : '❌ Missing',
        baseUrl: MPESA_BASE_URL ? '✅ Set' : '❌ Missing'
      },
      error: error.message
    });
  }
};

const initiateSTKPush = async (req, res) => {
  try {
    const { phone, amount, orderId, description } = req.body;

    console.log('📱 M-Pesa STK Push Request:', { phone, amount, orderId, description });

    // Validate input
    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and amount are required'
      });
    }

    // Format phone number (ensure it starts with 254)
    let formattedPhone = phone.toString().trim();
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+254')) {
      formattedPhone = formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    // Validate phone format
    if (!/^2547\d{8}$/.test(formattedPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Use 2547XXXXXXXX'
      });
    }

    // Validate amount
    const paymentAmount = parseInt(amount);
    if (paymentAmount < 1 || paymentAmount > 150000) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be between KES 1 and KES 150,000'
      });
    }

    // Get access token
    const accessToken = await getAccessToken();
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    // M-Pesa STK Push payload
    const stkPayload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: paymentAmount,
      PartyA: formattedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: orderId ? `ORDER-${orderId}` : "AGRI-PAY",
      TransactionDesc: description || "Payment for agricultural products"
    };

    console.log('🔄 Sending STK Push to M-Pesa...');
    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      stkPayload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const result = response.data;
    console.log('✅ M-Pesa Response:', result);

    if (result.ResponseCode === '0') {
      res.json({
        success: true,
        message: 'M-Pesa prompt sent to your phone',
        data: {
          checkoutRequestID: result.CheckoutRequestID,
          customerMessage: result.CustomerMessage,
          merchantRequestID: result.MerchantRequestID,
          amount: paymentAmount,
          phone: formattedPhone
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.errorMessage || 'Failed to initiate M-Pesa payment'
      });
    }

  } catch (error) {
    console.error('❌ M-Pesa STK Push error:', error.message);
    
    let errorMessage = 'Failed to process M-Pesa payment';
    
    if (error.response?.data?.errorMessage) {
      errorMessage = error.response.data.errorMessage;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to M-Pesa service';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'M-Pesa service timeout';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message
    });
  }
};

const handleCallback = (req, res) => {
  try {
    console.log('📞 M-Pesa Callback Received:', JSON.stringify(req.body, null, 2));
    const callbackData = req.body;

    if (callbackData.Body && callbackData.Body.stkCallback) {
      const resultCode = callbackData.Body.stkCallback.ResultCode;
      const resultDesc = callbackData.Body.stkCallback.ResultDesc;
      const checkoutRequestID = callbackData.Body.stkCallback.CheckoutRequestID;
      const merchantRequestID = callbackData.Body.stkCallback.MerchantRequestID;

      console.log(`🔄 Callback Details:`, {
        resultCode,
        resultDesc,
        checkoutRequestID,
        merchantRequestID
      });

      if (resultCode === 0) {
        console.log('✅ Payment successful!');
        const callbackMetadata = callbackData.Body.stkCallback.CallbackMetadata;
        if (callbackMetadata && callbackMetadata.Item) {
          const paymentData = {};
          callbackMetadata.Item.forEach(item => {
            paymentData[item.Name] = item.Value;
            console.log(`   ${item.Name}: ${item.Value}`);
          });
          
          // Here you would typically:
          // 1. Update your database with payment confirmation
          // 2. Send confirmation email/SMS
          // 3. Update order status
          console.log('💰 Payment Data:', paymentData);
        }
      } else {
        console.log('❌ Payment failed:', resultDesc);
        // Handle failed payment (update order status, notify user, etc.)
      }
    } else {
      console.log('⚠️ Unexpected callback format:', callbackData);
    }

    // Always return success to M-Pesa to acknowledge receipt
    res.json({
      ResultCode: 0,
      ResultDesc: 'Success'
    });

  } catch (error) {
    console.error('❌ Callback processing error:', error);
    // Still return success to M-Pesa to prevent retries
    res.json({
      ResultCode: 0,
      ResultDesc: 'Success'
    });
  }
};

const checkTransactionStatus = async (req, res) => {
  try {
    const { checkoutRequestID } = req.body;

    if (!checkoutRequestID) {
      return res.status(400).json({
        success: false,
        message: 'Checkout Request ID is required'
      });
    }

    const accessToken = await getAccessToken();
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    const statusPayload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID
    };

    console.log('🔄 Checking transaction status for:', checkoutRequestID);
    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      statusPayload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const result = response.data;
    console.log('📊 Transaction status result:', result);

    if (result.ResponseCode === '0') {
      const resultCode = result.ResultCode;
      
      if (resultCode === '0') {
        res.json({
          success: true,
          message: 'Payment completed successfully',
          status: 'completed',
          resultDesc: result.ResultDesc
        });
      } else {
        res.json({
          success: false,
          message: result.ResultDesc || 'Payment failed or was cancelled',
          status: 'failed',
          resultCode: resultCode
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to check transaction status',
        responseCode: result.ResponseCode
      });
    }

  } catch (error) {
    console.error('❌ Transaction status check error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to check transaction status',
      error: error.message
    });
  }
};

module.exports = {
  initiateSTKPush,
  handleCallback,
  checkTransactionStatus,
  testMpesaConfig,
  getAccessToken
};