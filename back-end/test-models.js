console.log('Testing models...');

try {
  const { User, FarmerProfile, Payment } = require('./models');
  console.log('✅ All models loaded successfully');
  
  if (User) console.log('✅ User model OK');
  if (FarmerProfile) console.log('✅ FarmerProfile model OK'); 
  if (Payment) console.log('✅ Payment model OK');
  
} catch (error) {
  console.log('❌ Models error: ' + error.message);
  console.log('Stack: ' + error.stack);
}
