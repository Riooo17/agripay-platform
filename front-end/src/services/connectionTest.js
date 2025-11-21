// src/services/connectionTest.js
import api from './api';

export const testBackendConnection = async () => {
  console.log('🔌 Testing connection to backend...');
  
  try {
    // Test 1: Basic health check
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test 2: Test if Paystack endpoint is reachable
    const paystackTest = await fetch('http://localhost:5000/api/paystack/health');
    console.log('✅ Paystack endpoint reachable');

    return {
      success: true,
      health: healthData,
      message: 'Backend connection successful!'
    };
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Cannot connect to backend. Make sure it\'s running on http://localhost:5000'
    };
  }
};