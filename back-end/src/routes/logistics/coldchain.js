// src/routes/logistics/coldchain.js
const express = require('express');
const router = express.Router();

// @route   POST /api/logistics/cold-chain/activate
// @desc    Activate cold chain monitoring
// @access  Public
router.post('/activate', (req, res) => {
  try {
    console.log('❄️ Activating cold chain monitoring...');
    
    // Mock cold chain activation
    const coldChainUnits = [
      {
        id: 'CCU-2847',
        cargo: 'Fresh Dairy',
        currentTemperature: 4.2,
        targetTemperature: 4.0,
        humidity: 65,
        qualityScore: 98,
        alertLevel: 'Stable',
        eta: '2.3 hours',
        status: 'active'
      },
      {
        id: 'CCU-2848',
        cargo: 'Flowers',
        currentTemperature: 2.1,
        targetTemperature: 2.0,
        humidity: 45,
        qualityScore: 95,
        alertLevel: 'Stable',
        eta: '1.8 hours',
        status: 'active'
      },
      {
        id: 'CCU-2849',
        cargo: 'Fresh Fish',
        currentTemperature: 1.8,
        targetTemperature: 1.5,
        humidity: 70,
        qualityScore: 92,
        alertLevel: 'Watch',
        eta: '3.1 hours',
        status: 'active'
      }
    ];

    res.json({
      success: true,
      message: 'Cold chain monitoring activated successfully',
      data: coldChainUnits
    });

  } catch (error) {
    console.error('Cold chain activation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error activating cold chain' 
    });
  }
});

// @route   GET /api/logistics/cold-chain/units
// @desc    Get cold chain units
// @access  Public
router.get('/units', (req, res) => {
  try {
    const coldChainUnits = [
      {
        id: 'CCU-2847',
        cargo: 'Fresh Dairy',
        currentTemperature: 4.2,
        targetTemperature: 4.0,
        humidity: 65,
        qualityScore: 98,
        alertLevel: 'Stable',
        eta: '2.3 hours'
      },
      {
        id: 'CCU-2848',
        cargo: 'Flowers',
        currentTemperature: 2.1,
        targetTemperature: 2.0,
        humidity: 45,
        qualityScore: 95,
        alertLevel: 'Stable',
        eta: '1.8 hours'
      }
    ];

    res.json({
      success: true,
      data: coldChainUnits
    });

  } catch (error) {
    console.error('Get cold chain units error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching cold chain units' 
    });
  }
});

module.exports = router;