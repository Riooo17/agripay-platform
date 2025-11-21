// src/routes/logistics/dashboard.js
const express = require('express');
const router = express.Router();

// @route   GET /api/logistics/dashboard
// @desc    Get logistics dashboard data
// @access  Public (for now, add auth later)
router.get('/', (req, res) => {
  try {
    console.log('📊 Fetching logistics dashboard data...');
    
    // Return mock data for now - we'll connect to DB later
    const mockData = {
      totalShipments: 45,
      activeShipments: 12,
      vehiclesAvailable: 8,
      pendingDeliveries: 5,
      perishableShipments: 156,
      ruralCoverage: '83%',
      coldChainIntegrity: '99.2%',
      predictiveAccuracy: '94% accuracy',
      recentActivities: [
        { description: 'Delivery DR-2847 completed successfully', time: '2 hours ago' },
        { description: 'New route optimization applied', time: '4 hours ago' },
        { description: 'Vehicle maintenance completed', time: '1 day ago' }
      ],
      recentShipments: [
        {
          id: 'DR-2847',
          trackingNumber: 'DR-2847',
          customer: { name: 'Fresh Farms Ltd' },
          status: 'in_transit',
          amount: 8500,
          origin: 'Kiambu',
          destination: 'Nairobi CBD',
          currentLocation: 'Along Mombasa Road'
        }
      ],
      vehicles: [
        {
          id: 1,
          make: 'Toyota',
          model: 'Hilux',
          licensePlate: 'KCD 123A',
          status: 'active',
          driver: { name: 'John Kamau' },
          currentLocation: 'Nairobi CBD',
          currentCargo: 'Fresh Vegetables',
          eta: '25 min'
        }
      ],
      coldChainUnits: [
        {
          id: 'CCU-2847',
          cargo: 'Fresh Dairy',
          currentTemperature: 4.2,
          targetTemperature: 4.0,
          humidity: 65,
          qualityScore: 98,
          alertLevel: 'Stable',
          eta: '2.3 hours'
        }
      ],
      predictions: [
        {
          id: 1,
          prediction: 'Traffic congestion expected on Thika Road in 45min',
          impact: 'High',
          confidence: '92%',
          action: 'Reroute suggested'
        }
      ],
      optimizedRoutes: [
        {
          id: 'RT-001',
          origin: 'Nakuru Farms',
          destination: 'Mombasa Port',
          optimization: 'AI-Weather-Adjusted',
          savings: '3.2 hours, 18% fuel',
          risk: 'Low',
          perishableScore: 'A+'
        }
      ]
    };

    res.json({
      success: true,
      data: mockData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching dashboard data' 
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Logistics dashboard routes are working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;