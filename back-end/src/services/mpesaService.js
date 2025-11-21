const axios = require('axios');
const crypto = require('crypto');
const moment = require('moment');

class MpesaService {
  constructor() {
    this.baseURL = process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke';
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.passkey = process.env.MPESA_PASSKEY;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.callbackURL = process.env.MPESA_CALLBACK_URL || 'http://localhost:5000/api/mpesa/callback';
    
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async generateAccessToken() {
    try {
      if (this.accessToken && this.tokenExpiry && moment().isBefore(this.tokenExpiry)) {
        return this.accessToken;
      }

      console.log('🔐 Generating M-Pesa access token...');
      
      const credentials = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.access_token) {
        throw new Error('No access token received from M-Pesa');
      }

      this.accessToken = response.data.access_token;
      this.tokenExpiry = moment().add(55, 'minutes');
      
      console.log('✅ M-Pesa access token generated');
      return this.accessToken;

    } catch (error) {
      console.error('❌ M-Pesa token error:', error.response?.data || error.message);
      throw new Error(`Failed to generate M-Pesa access token: ${error.message}`);
    }
  }

  generatePassword() {
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const dataToEncode = `${this.shortcode}${this.passkey}${timestamp}`;
    const password = Buffer.from(dataToEncode).toString('base64');
    return { password, timestamp };
  }

  async stkPush(phoneNumber, amount, accountReference, transactionDesc = 'AgriPay Payment') {
    try {
      console.log('📱 Initiating STK Push:', { phoneNumber, amount, accountReference });

      // Validate inputs
      if (!phoneNumber || !amount || !accountReference) {
        throw new Error('Missing required parameters');
      }

      if (amount < 1 || amount > 150000) {
        throw new Error('Amount must be between 1 and 150,000 KES');
      }

      const accessToken = await this.generateAccessToken();
      const { password, timestamp } = this.generatePassword();

      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const requestData = {
        BusinessShortCode: parseInt(this.shortcode),
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: parseInt(amount),
        PartyA: parseInt(formattedPhone),
        PartyB: parseInt(this.shortcode),
        PhoneNumber: parseInt(formattedPhone),
        CallBackURL: this.callbackURL,
        AccountReference: accountReference.substring(0, 12),
        TransactionDesc: transactionDesc.substring(0, 13)
      };

      console.log('📤 Sending STK Push request...');

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpush/v1/processrequest`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      console.log('✅ STK Push response:', response.data);

      if (response.data.ResponseCode !== '0') {
        throw new Error(`M-Pesa Error: ${response.data.ResponseDescription}`);
      }

      return {
        success: true,
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        customerMessage: response.data.CustomerMessage,
        responseDescription: response.data.ResponseDescription
      };

    } catch (error) {
      console.error('❌ STK Push failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data || error.message,
        errorCode: error.response?.data?.errorCode || 'REQUEST_FAILED'
      };
    }
  }

  formatPhoneNumber(phone) {
    if (!phone) throw new Error('Phone number is required');

    let cleaned = phone.toString().replace(/\D/g, '');
    
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    if (!/^254[17]\d{8}$/.test(cleaned)) {
      throw new Error('Invalid phone number format');
    }
    
    return cleaned;
  }
}

const mpesaService = new MpesaService();
module.exports = mpesaService;