const axios = require('axios');

class PaymentService {
  constructor() {
    this.paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    this.flutterwaveSecret = process.env.FLUTTERWAVE_SECRET_KEY;
  }

  // Paystack payment initialization - FIXED CURRENCY FOR KENYA
  async initializePaystackPayment(paymentData) {
    try {
      // Validate required fields
      if (!paymentData.email || !paymentData.amount) {
        throw new Error('Email and amount are required');
      }

      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: paymentData.email,
          amount: paymentData.amount * 100, // Convert to kobo/cents
          currency: paymentData.currency || 'KES', // CHANGED TO KES FOR KENYA
          reference: paymentData.reference || `AGRIPAY_${Date.now()}`,
          callback_url: paymentData.callbackUrl || 'https://agripay-platform.onrender.com/api/payments/verify',
          channels: ['card', 'bank', 'mobile_money'], // ADDED PAYMENT CHANNELS
          metadata: paymentData.metadata || {}
        },
        {
          headers: {
            Authorization: 'Bearer ' + this.paystackSecret,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // ADDED TIMEOUT
        }
      );

      return response.data;
    } catch (error) {
      console.error('Paystack Init Error:', error.response?.data || error.message);
      throw new Error('Paystack initialization failed: ' + (error.response?.data?.message || error.message));
    }
  }

  // Verify Paystack payment - FIXED ERROR HANDLING
  async verifyPaystackPayment(reference) {
    try {
      if (!reference) {
        throw new Error('Payment reference is required');
      }

      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: 'Bearer ' + this.paystackSecret
          },
          timeout: 30000
        }
      );

      return response.data;
    } catch (error) {
      console.error('Paystack Verify Error:', error.response?.data || error.message);
      throw new Error('Paystack verification failed: ' + (error.response?.data?.message || error.message));
    }
  }

  // Flutterwave payment initialization - FIXED CURRENCY
  async initializeFlutterwavePayment(paymentData) {
    try {
      if (!this.flutterwaveSecret) {
        throw new Error('Flutterwave secret key not configured');
      }

      const response = await axios.post(
        'https://api.flutterwave.com/v3/payments',
        {
          tx_ref: paymentData.reference || `AGRIPAY_FW_${Date.now()}`,
          amount: paymentData.amount,
          currency: paymentData.currency || 'KES', // CHANGED TO KES
          redirect_url: paymentData.redirectUrl || 'https://agripayafrica.netlify.app/payment/success',
          customer: {
            email: paymentData.email,
            name: paymentData.customerName || 'Customer'
          },
          customizations: {
            title: 'AgriPay Africa',
            description: paymentData.description || 'Agricultural Payment'
          },
          meta: paymentData.metadata || {}
        },
        {
          headers: {
            Authorization: 'Bearer ' + this.flutterwaveSecret,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      return response.data;
    } catch (error) {
      console.error('Flutterwave Init Error:', error.response?.data || error.message);
      throw new Error('Flutterwave initialization failed: ' + (error.response?.data?.message || error.message));
    }
  }

  // Verify Flutterwave payment - FIXED PARAMETER
  async verifyFlutterwavePayment(transactionId) {
    try {
      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }

      const response = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
        {
          headers: {
            Authorization: 'Bearer ' + this.flutterwaveSecret
          },
          timeout: 30000
        }
      );

      return response.data;
    } catch (error) {
      console.error('Flutterwave Verify Error:', error.response?.data || error.message);
      throw new Error('Flutterwave verification failed: ' + (error.response?.data?.message || error.message));
    }
  }

  // ADDED: Check service availability
  async checkPaystackService() {
    try {
      const response = await axios.get('https://api.paystack.co/bank?currency=KES', {
        headers: {
          Authorization: 'Bearer ' + this.paystackSecret
        },
        timeout: 10000
      });
      return { available: true, banks: response.data.data?.length || 0 };
    } catch (error) {
      return { available: false, error: error.message };
    }
  }
}

module.exports = new PaymentService();