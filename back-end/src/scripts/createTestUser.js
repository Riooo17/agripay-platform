const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Check if test user exists
    let testUser = await User.findOne({ email: 'test@agripay.com' });
    
    if (!testUser) {
      // Create test user
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      testUser = new User({
        email: 'test@agripay.com',
        password: hashedPassword,
        profile: {
          firstName: 'Test',
          lastName: 'Farmer',
          phone: '254708374149'
        },
        role: 'farmer',
        isVerified: true
      });

      await testUser.save();
      console.log('✅ Test user created:', testUser.email);
    } else {
      console.log('✅ Test user already exists:', testUser.email);
    }

    console.log('🔑 Test Credentials:');
    console.log('Email: test@agripay.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestUser();