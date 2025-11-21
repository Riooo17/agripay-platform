const syncDatabase = async () => {
  try {
    // Use correct relative path
    const { sequelize } = require('../models');
    
    if (!sequelize) {
      console.log('⚠️  Database not available');
      return;
    }

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync models
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database synchronized');
    
  } catch (error) {
    console.log('❌ Database setup failed: ' + error.message);
  }
};

module.exports = syncDatabase;
