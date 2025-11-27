// services/paystackService.js
const axios = require('axios');

class PaystackService {
  constructor() {
    this.baseURL = 'https://api.paystack.co';
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.callbackURL = process.env.PAYSTACK_CALLBACK_URL || 'https://agripay-platform.onrender.com/api/paystack/callback';
    
    if (!this.secretKey) {
      console.warn('⚠️  Paystack secret key not configured');
    }
  }

  async makeRequest(endpoint, data = null, method = 'GET') {
    try {
      const config = {
        method: method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      };

      if (data && method !== 'GET') {
        config.data = data;
      }

      console.log(`🔗 Paystack API: ${method} ${endpoint}`);
      const response = await axios(config);
      
      return response.data;

    } catch (error) {
      console.error('❌ Paystack API error:', {
        endpoint: endpoint,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      throw new Error(`Paystack API failed: ${error.response?.data?.message || error.message}`);
    }
  }

  formatAmount(amount) {
    // Convert KES to kobo (100 KES = 10000 kobo)
    return Math.round(amount * 100);
  }

  async initializePayment(email, amount, metadata = {}) {
    try {
      console.log('💰 Initializing Paystack payment:', { email, amount });

      // Validate inputs
      if (!email || !amount) {
        throw new Error('Email and amount are required');
      }

      if (amount < 1) {
        throw new Error('Amount must be at least 1 KES');
      }

      const amountInKobo = this.formatAmount(amount);

      const payload = {
        email: email,
        amount: amountInKobo,
        currency: 'KES',
        channels: ['card', 'mobile_money', 'bank'],
        callback_url: this.callbackURL,
        metadata: {
          custom_fields: [
            {
              display_name: "Platform",
              variable_name: "platform",
              value: "AgriPay"
            },
            {
              display_name: "Payment Type", 
              variable_name: "payment_type",
              value: "agricultural_products"
            },
            ...(metadata.custom_fields || [])
          ],
          ...metadata
        }
      };

      console.log('📤 Sending payment initialization to Paystack...');
      const response = await this.makeRequest('/transaction/initialize', payload, 'POST');

      if (!response.status) {
        throw new Error(response.message || 'Failed to initialize payment');
      }

      console.log('✅ Payment initialized successfully:', {
        reference: response.data.reference,
        amount: amount,
        email: email
      });

      return {
        success: true,
        authorization_url: response.data.authorization_url,
        access_code: response.data.access_code,
        reference: response.data.reference
      };

    } catch (error) {
      console.error('❌ Payment initialization failed:', error.message);
      
      return {
        success: false,
        error: error.message,
        errorCode: 'PAYMENT_INIT_FAILED'
      };
    }
  }

  async verifyPayment(reference) {
    try {
      console.log('🔍 Verifying Paystack payment:', reference);

      if (!reference) {
        throw new Error('Payment reference is required');
      }

      const response = await this.makeRequest(`/transaction/verify/${reference}`);

      if (!response.status) {
        throw new Error(response.message || 'Verification failed');
      }

      const transaction = response.data;

      console.log('📊 Payment verification result:', {
        reference: reference,
        status: transaction.status,
        amount: transaction.amount,
        paid: transaction.status === 'success'
      });

      return {
        success: true,
        paid: transaction.status === 'success',
        status: transaction.status,
        amount: transaction.amount / 100, // Convert back to KES
        currency: transaction.currency,
        reference: transaction.reference,
        paid_at: transaction.paid_at,
        customer: transaction.customer,
        gateway_response: transaction.gateway_response
      };

    } catch (error) {
      console.error('❌ Payment verification failed:', error.message);
      
      return {
        success: false,
        error: error.message,
        errorCode: 'VERIFICATION_FAILED'
      };
    }
  }

  async listBanks() {
    try {
      console.log('🏦 Fetching banks from Paystack...');
      
      const response = await this.makeRequest('/bank');
      
      return {
        success: true,
        banks: response.data
      };

    } catch (error) {
      console.error('❌ Failed to fetch banks:', error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createTransferRecipient(name, accountNumber, bankCode) {
    try {
      console.log('👤 Creating transfer recipient:', { name, bankCode });

      const payload = {
        type: 'nuban',
        name: name,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: 'KES'
      };

      const response = await this.makeRequest('/transferrecipient', payload, 'POST');

      return {
        success: true,
        recipient_code: response.data.recipient_code,
        details: response.data
      };

    } catch (error) {
      console.error('❌ Failed to create transfer recipient:', error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  async testConnection() {
    try {
      console.log('🔗 Testing Paystack connection...');
      
      const response = await this.makeRequest('/bank?perPage=1');
      
      return {
        success: true,
        message: 'Paystack connection successful',
        banks_count: response.meta.total,
        mode: this.secretKey?.startsWith('sk_live_') ? 'LIVE' : 'TEST'
      };

    } catch (error) {
      console.error('❌ Paystack connection test failed:', error.message);
      
      return {
        success: false,
        error: error.message,
        mode: this.secretKey?.startsWith('sk_live_') ? 'LIVE' : 'TEST'
      };
    }
  }

  // Webhook signature verification (for production)
  verifyWebhookSignature(payload, signature) {
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha512', this.secretKey)
                      .update(JSON.stringify(payload))
                      .digest('hex');
    return hash === signature;
  }
}

const paystackService = new PaystackService();
module.exports = paystackService;