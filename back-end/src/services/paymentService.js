const axios = require('axios');

class PaymentService {
  constructor() {
    this.paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    this.flutterwaveSecret = process.env.FLUTTERWAVE_SECRET_KEY;
  }

  // Paystack payment initialization
  async initializePaystackPayment(paymentData) {
    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: paymentData.email,
          amount: paymentData.amount * 100, // Convert to kobo
          currency: paymentData.currency || 'NGN',
          reference: paymentData.reference,
          callback_url: paymentData.callbackUrl,
          metadata: paymentData.metadata
        },
        {
          headers: {
            Authorization: 'Bearer ' + this.paystackSecret,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Paystack initialization failed: ' + (error.response?.data?.message || error.message));
    }
  }

  // Verify Paystack payment
  async verifyPaystackPayment(reference) {
    try {
      const response = await axios.get(
        'https://api.paystack.co/transaction/verify/' + reference,
        {
          headers: {
            Authorization: 'Bearer ' + this.paystackSecret
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Paystack verification failed: ' + (error.response?.data?.message || error.message));
    }
  }

  // Flutterwave payment initialization
  async initializeFlutterwavePayment(paymentData) {
    try {
      const response = await axios.post(
        'https://api.flutterwave.com/v3/payments',
        {
          tx_ref: paymentData.reference,
          amount: paymentData.amount,
          currency: paymentData.currency || 'NGN',
          redirect_url: paymentData.redirectUrl,
          customer: {
            email: paymentData.email,
            name: paymentData.customerName
          },
          customizations: {
            title: 'AgriPay',
            description: paymentData.description || 'Agricultural Payment'
          },
          meta: paymentData.metadata
        },
        {
          headers: {
            Authorization: 'Bearer ' + this.flutterwaveSecret,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Flutterwave initialization failed: ' + (error.response?.data?.message || error.message));
    }
  }

  // Verify Flutterwave payment
  async verifyFlutterwavePayment(transactionId) {
    try {
      const response = await axios.get(
        'https://api.flutterwave.com/v3/transactions/' + transactionId + '/verify',
        {
          headers: {
            Authorization: 'Bearer ' + this.flutterwaveSecret
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Flutterwave verification failed: ' + (error.response?.data?.message || error.message));
    }
  }
}

module.exports = new PaymentService();
