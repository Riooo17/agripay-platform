// src/routes/logistics/shipments.js
const express = require('express');
const router = express.Router();

// @route   GET /api/logistics/shipments
// @desc    Get all shipments with optional status filter
// @access  Public (for now, add auth later)
router.get('/', (req, res) => {
  try {
    const { status } = req.query;
    
    // Mock data for now
    const mockShipments = [
      {
        id: 'DR-2847',
        trackingNumber: 'DR-2847',
        customer: { name: 'Fresh Farms Ltd' },
        status: 'in_transit',
        amount: 8500,
        origin: 'Kiambu',
        destination: 'Nairobi CBD',
        currentLocation: 'Along Mombasa Road',
        progress: 65,
        driver: { name: 'John Kamau' },
        vehicle: { name: 'Toyota Hilux', licensePlate: 'KCD 123A' }
      },
      {
        id: 'DR-2846',
        trackingNumber: 'DR-2846',
        customer: { name: 'Nairobi Market Hub' },
        status: 'pending',
        amount: 12000,
        origin: 'Thika',
        destination: 'Westlands',
        currentLocation: 'Warehouse',
        progress: 0,
        driver: null,
        vehicle: null
      },
      {
        id: 'DR-2845',
        trackingNumber: 'DR-2845',
        customer: { name: 'Green Valley Produce' },
        status: 'completed',
        amount: 6700,
        origin: 'Limuru',
        destination: 'Karen',
        currentLocation: 'Delivered',
        progress: 100,
        driver: { name: 'Sarah Mwende' },
        vehicle: { name: 'Isuzu NPR', licensePlate: 'KAB 456B' }
      }
    ];

    // Filter by status if provided
    let filteredShipments = mockShipments;
    if (status) {
      filteredShipments = mockShipments.filter(shipment => shipment.status === status);
    }

    res.json({
      success: true,
      count: filteredShipments.length,
      data: filteredShipments
    });

  } catch (error) {
    console.error('Shipments error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching shipments' 
    });
  }
});

// @route   PUT /api/logistics/shipments/:id
// @desc    Update shipment status
// @access  Public (for now, add auth later)
router.put('/:id', (req, res) => {
  try {
    const { status, currentLocation, progress } = req.body;
    const shipmentId = req.params.id;

    // Mock update - in real app, update database
    console.log(`Updating shipment ${shipmentId} to status: ${status}`);

    res.json({
      success: true,
      message: `Shipment ${shipmentId} updated to ${status}`,
      data: {
        id: shipmentId,
        status,
        currentLocation,
        progress,
        updatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Update shipment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating shipment' 
    });
  }
});

// @route   POST /api/logistics/shipments/seed
// @desc    Add sample shipments data
// @access  Public
router.post('/seed', (req, res) => {
  try {
    console.log('🌱 Seeding sample shipments data...');
    
    // This is just a confirmation endpoint since we're using mock data
    // In a real app, this would insert into database
    
    res.json({
      success: true,
      message: 'Sample shipments data is now available',
      data: [
        {
          id: 'DR-2847',
          trackingNumber: 'DR-2847',
          customer: { name: 'Fresh Farms Ltd' },
          status: 'in_transit',
          amount: 8500,
          origin: 'Kiambu',
          destination: 'Nairobi CBD',
          currentLocation: 'Along Mombasa Road',
          progress: 65
        },
        {
          id: 'DR-2846',
          trackingNumber: 'DR-2846',
          customer: { name: 'Nairobi Market Hub' },
          status: 'pending',
          amount: 12000,
          origin: 'Thika',
          destination: 'Westlands',
          currentLocation: 'Warehouse',
          progress: 0
        },
        {
          id: 'DR-2845',
          trackingNumber: 'DR-2845',
          customer: { name: 'Green Valley Produce' },
          status: 'completed',
          amount: 6700,
          origin: 'Limuru',
          destination: 'Karen',
          currentLocation: 'Delivered',
          progress: 100
        }
      ]
    });

  } catch (error) {
    console.error('Seed shipments error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error seeding shipments' 
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Logistics shipments routes are working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;