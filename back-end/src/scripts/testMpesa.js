const axios = require('axios');

const testMpesa = async () => {
  try {
    // 1. Get token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@agripay.com',
      password: 'password123'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Got token successfully');

    // 2. Test MPesa
    const mpesaResponse = await axios.post('http://localhost:5000/api/mpesa/initialize', {
      amount: 1,
      phoneNumber: "254708374149",
      description: "Test MPesa Payment",
      orderType: "input_purchase",
      productName: "Test Seeds"
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ MPesa Test Successful:');
    console.log(JSON.stringify(mpesaResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Test Failed:');
    console.error(error.response?.data || error.message);
  }
};

testMpesa();