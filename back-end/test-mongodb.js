const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Exists' : 'Missing');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully!');
    process.exit(0);
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
}

testConnection();
