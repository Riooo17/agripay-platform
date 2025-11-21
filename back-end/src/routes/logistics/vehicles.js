// src/routes/logistics/vehicles.js
const express = require('express');
const router = express.Router();

// @route   GET /api/logistics/vehicles
// @desc    Get all vehicles with optional status filter
// @access  Public (for now, add auth later)
router.get('/', (req, res) => {
  try {
    const { status } = req.query;
    
    // Mock data for now
    const mockVehicles = [
      {
        id: 1,
        licensePlate: 'KCD 123A',
        make: 'Toyota',
        model: 'Hilux',
        name: 'Toyota Hilux KCD 123A',
        status: 'active',
        driver: { name: 'John Kamau', email: 'john@agripay.com', phone: '254712345678' },
        currentLocation: 'Nairobi CBD',
        currentCargo: 'Fresh Vegetables',
        capacity: 1500,
        fuelLevel: 85,
        eta: '25 min',
        coordinates: { lat: -1.2921, lng: 36.8219 }
      },
      {
        id: 2,
        licensePlate: 'KAB 456B',
        make: 'Isuzu',
        model: 'NPR',
        name: 'Isuzu NPR KAB 456B',
        status: 'maintenance',
        driver: { name: 'Sarah Mwende', email: 'sarah@agripay.com', phone: '254723456789' },
        currentLocation: 'Depot',
        currentCargo: 'Dairy Products',
        capacity: 2000,
        fuelLevel: 45,
        eta: 'N/A',
        coordinates: { lat: -1.3000, lng: 36.8000 }
      },
      {
        id: 3,
        licensePlate: 'KCE 789C',
        make: 'Mitsubishi',
        model: 'Fuso',
        name: 'Mitsubishi Fuso KCE 789C',
        status: 'active',
        driver: { name: 'Mike Ochieng', email: 'mike@agripay.com', phone: '254734567890' },
        currentLocation: 'Mombasa Road',
        currentCargo: 'Grains',
        capacity: 5000,
        fuelLevel: 72,
        eta: '3 hours',
        coordinates: { lat: -1.3500, lng: 36.8500 }
      }
    ];

    // Filter by status if provided
    let filteredVehicles = mockVehicles;
    if (status) {
      filteredVehicles = mockVehicles.filter(vehicle => vehicle.status === status);
    }

    res.json({
      success: true,
      count: filteredVehicles.length,
      data: filteredVehicles
    });

  } catch (error) {
    console.error('Vehicles error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching vehicles' 
    });
  }
});

// @route   PUT /api/logistics/vehicles/:id
// @desc    Update vehicle status
// @access  Public (for now, add auth later)
router.put('/:id', (req, res) => {
  try {
    const { status, currentLocation, eta } = req.body;
    const vehicleId = req.params.id;

    // Mock update - in real app, update database
    console.log(`Updating vehicle ${vehicleId} to status: ${status}`);

    res.json({
      success: true,
      message: `Vehicle ${vehicleId} updated to ${status}`,
      data: {
        id: vehicleId,
        status,
        currentLocation,
        eta,
        updatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating vehicle' 
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Logistics vehicles routes are working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;