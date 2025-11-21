const axios = require('axios');

const getTestToken = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@agripay.com',
      password: 'password123'
    });

    const token = response.data.data.token;
    console.log('✅ TEST TOKEN:');
    console.log(token);
    console.log('\n📋 Use this token in your tests:');
    console.log(`Authorization: Bearer ${token}`);
    
    return token;
  } catch (error) {
    console.error('❌ Failed to get token:', error.response?.data || error.message);
  }
};

getTestToken();