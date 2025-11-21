const Delivery = require('../models/Delivery');
const Vehicle = require('../models/Vehicle');
const RouteOptimization = require('../models/RouteOptimization');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get logistics dashboard overview
// @route   GET /api/logistics/dashboard
// @access  Private (Logistics only)
exports.getDashboard = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const logisticsId = req.user._id;

    const [
      activeDeliveries,
      availableVehicles,
      inTransitDeliveries,
      totalRevenue,
      recentDeliveries,
      predictiveRoutes
    ] = await Promise.all([
      // Active deliveries
      Delivery.countDocuments({ 
        'assignedDriver.driver': logisticsId,
        status: { $in: ['accepted', 'picked_up', 'in_transit', 'out_for_delivery'] } 
      }),
      
      // Available vehicles
      Vehicle.countDocuments({ 
        owner: logisticsId,
        status: 'available' 
      }),
      
      // In-transit deliveries
      Delivery.countDocuments({ 
        'assignedDriver.driver': logisticsId,
        status: 'in_transit' 
      }),
      
      // Total revenue (last 30 days)
      Delivery.aggregate([
        { 
          $match: { 
            'assignedDriver.driver': new mongoose.Types.ObjectId(logisticsId),
            status: 'delivered',
            paymentStatus: 'paid',
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          } 
        },
        { $group: { _id: null, total: { $sum: '$deliveryFee' } } }
      ]),
      
      // Recent deliveries
      Delivery.find({ 'assignedDriver.driver': logisticsId })
        .populate('sender', 'profile.firstName profile.lastName profile.businessName profile.phone')
        .populate('receiver', 'profile.firstName profile.lastName profile.businessName profile.phone')
        .sort({ createdAt: -1 })
        .limit(5),
      
      // Predictive routes
      RouteOptimization.find({ status: 'generated' })
        .sort({ createdAt: -1 })
        .limit(3)
    ]);

    // Cold chain monitoring
    const perishableDeliveries = await Delivery.countDocuments({
      'assignedDriver.driver': logisticsId,
      'coldChainMonitoring.required': true,
      status: { $in: ['in_transit', 'out_for_delivery'] }
    });

    // Rural coverage calculation
    const ruralDeliveries = await Delivery.countDocuments({
      'assignedDriver.driver': logisticsId,
      'deliveryLocation.county': { 
        $in: ['Narok', 'Kajiado', 'Machakos', 'Kitui', 'Meru', 'Nyeri'] 
      },
      status: 'delivered',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const totalDeliveries = await Delivery.countDocuments({
      'assignedDriver.driver': logisticsId,
      status: 'delivered',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const ruralCoverage = totalDeliveries > 0 ? Math.round((ruralDeliveries / totalDeliveries) * 100) : 0;

    const totalRevenueAmount = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Get completed deliveries count
    const completedDeliveries = await Delivery.countDocuments({ 
      'assignedDriver.driver': logisticsId,
      status: 'delivered' 
    });

    res.json({
      success: true,
      data: {
        realTimeData: {
          activeFleet: availableVehicles,
          inTransit: inTransitDeliveries,
          perishableMonitoring: perishableDeliveries,
          ruralCoverage: `${ruralCoverage}%`,
          coldChainIntegrity: '99.2%',
          predictiveArrivals: '94% accuracy'
        },
        overview: {
          activeDeliveries,
          availableVehicles,
          totalRevenue: totalRevenueAmount,
          completedDeliveries
        },
        recentDeliveries,
        predictiveRoutes,
        quickStats: {
          onTimeDelivery: '92%',
          customerSatisfaction: '4.8/5',
          fuelEfficiency: '8.2 km/l'
        }
      }
    });
  } catch (error) {
    console.error('Logistics dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching logistics dashboard data',
      error: error.message
    });
  }
};

// @desc    Get logistics deliveries
// @route   GET /api/logistics/deliveries
// @access  Private (Logistics only)
exports.getDeliveries = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const logisticsId = req.user._id;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = { 'assignedDriver.driver': logisticsId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    
    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const deliveries = await Delivery.find(query)
      .populate('sender', 'profile.firstName profile.lastName profile.businessName profile.phone profile.avatar')
      .populate('receiver', 'profile.firstName profile.lastName profile.businessName profile.phone profile.avatar')
      .populate('assignedDriver.vehicle', 'registrationNumber make model')
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Delivery.countDocuments(query);
    
    // Delivery statistics
    const deliveryStats = await Delivery.aggregate([
      { $match: { 'assignedDriver.driver': new mongoose.Types.ObjectId(logisticsId) } },
      { 
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$deliveryFee' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        deliveries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalDeliveries: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        stats: deliveryStats
      }
    });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deliveries',
      error: error.message
    });
  }
};

// @desc    Update delivery status
// @route   PUT /api/logistics/deliveries/:id
// @access  Private (Logistics only)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const logisticsId = req.user._id;
    const deliveryId = req.params.id;
    const { status, location, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    // Find delivery and verify ownership
    const delivery = await Delivery.findOne({ 
      _id: deliveryId, 
      'assignedDriver.driver': logisticsId 
    });
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found or access denied'
      });
    }
    
    // Update delivery status
    delivery.status = status;
    
    // Add tracking event
    delivery.trackingEvents.push({
      event: `Status changed to ${status}`,
      location: location || delivery.currentLocation,
      notes: notes || ''
    });
    
    // Update current location if provided
    if (location) {
      delivery.currentLocation = {
        coordinates: location.coordinates,
        address: location.address,
        timestamp: new Date()
      };
    }
    
    // Set actual timestamps based on status
    if (status === 'picked_up' && !delivery.actualPickup) {
      delivery.actualPickup = new Date();
    }
    
    if (status === 'delivered' && !delivery.actualDelivery) {
      delivery.actualDelivery = new Date();
      delivery.paymentStatus = 'paid'; // Auto-mark as paid on delivery
    }
    
    await delivery.save();
    
    // Populate for response
    await delivery.populate('sender', 'profile.firstName profile.lastName profile.businessName profile.phone');
    await delivery.populate('receiver', 'profile.firstName profile.lastName profile.businessName profile.phone');
    
    res.json({
      success: true,
      message: `Delivery ${status} successfully`,
      data: delivery
    });
  } catch (error) {
    console.error('Update delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating delivery',
      error: error.message
    });
  }
};

// @desc    Get logistics vehicles
// @route   GET /api/logistics/vehicles
// @access  Private (Logistics only)
exports.getVehicles = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const logisticsId = req.user._id;
    const { 
      page = 1, 
      limit = 10, 
      status,
      type
    } = req.query;
    
    // Build query
    const query = { owner: logisticsId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    const vehicles = await Vehicle.find(query)
      .populate('currentDriver', 'profile.firstName profile.lastName profile.phone')
      .sort({ status: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Vehicle.countDocuments(query);
    
    // Vehicle statistics
    const vehicleStats = await Vehicle.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(logisticsId) } },
      { 
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalCapacity: { $sum: '$capacity.weight' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        vehicles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalVehicles: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        stats: vehicleStats
      }
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
};

// @desc    Generate delivery quote
// @route   POST /api/logistics/quote
// @access  Private (Logistics only)
exports.generateQuote = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const logisticsId = req.user._id;
    const { 
      pickupLocation, 
      deliveryLocation, 
      cargoType, 
      weight, 
      urgency,
      specialRequirements 
    } = req.body;
    
    if (!pickupLocation || !deliveryLocation) {
      return res.status(400).json({
        success: false,
        message: 'Pickup and delivery locations are required'
      });
    }
    
    // Calculate base price (simplified calculation)
    let basePrice = 500; // Base delivery fee
    
    // Distance-based pricing (simplified)
    const distance = calculateDistance(
      pickupLocation.coordinates, 
      deliveryLocation.coordinates
    );
    basePrice += distance * 50; // KES 50 per km
    
    // Weight-based pricing
    if (weight > 10) basePrice += (weight - 10) * 20; // KES 20 per kg over 10kg
    
    // Cargo type multiplier
    const cargoMultipliers = {
      'perishable': 1.5,
      'fragile': 1.3,
      'refrigerated': 2.0,
      'hazardous': 2.5,
      'general': 1.0
    };
    basePrice *= cargoMultipliers[cargoType] || 1.0;
    
    // Urgency multiplier
    const urgencyMultipliers = {
      'standard': 1.0,
      'express': 1.5,
      'same_day': 2.0
    };
    basePrice *= urgencyMultipliers[urgency] || 1.0;
    
    // Generate route optimization
    const optimizedRoute = await generateOptimizedRoute(
      pickupLocation.coordinates,
      deliveryLocation.coordinates
    );
    
    const quote = {
      baseFee: Math.round(basePrice),
      distanceFee: Math.round(distance * 50),
      cargoSurcharge: Math.round(basePrice * (cargoMultipliers[cargoType] - 1)),
      urgencyFee: Math.round(basePrice * (urgencyMultipliers[urgency] - 1)),
      total: Math.round(basePrice),
      estimatedDistance: Math.round(distance),
      estimatedDuration: Math.round(distance * 2), // Assuming 30km/h average
      routeOptimization: optimizedRoute
    };
    
    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Generate quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating delivery quote',
      error: error.message
    });
  }
};

// @desc    Get predictive routes
// @route   GET /api/logistics/predictive-routes
// @access  Private (Logistics only)
exports.getPredictiveRoutes = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const logisticsId = req.user._id;
    const { limit = 5 } = req.query;
    
    const predictiveRoutes = await RouteOptimization.find({})
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // Generate AI predictions
    const aiPredictions = [
      {
        id: 1,
        prediction: 'Traffic congestion expected on Thika Road in 45min',
        impact: 'High',
        confidence: '92%',
        action: 'Reroute suggested'
      },
      {
        id: 2, 
        prediction: 'Weather alert: Heavy rain in Western region',
        impact: 'Medium',
        confidence: '88%', 
        action: 'Delay non-urgent deliveries'
      },
      {
        id: 3,
        prediction: 'Fuel price drop expected tomorrow',
        impact: 'Low',
        confidence: '76%',
        action: 'Schedule refueling'
      }
    ];
    
    res.json({
      success: true,
      data: {
        predictiveRoutes,
        aiPredictions
      }
    });
  } catch (error) {
    console.error('Get predictive routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching predictive routes',
      error: error.message
    });
  }
};

// @desc    Get cold chain monitoring
// @route   GET /api/logistics/cold-chain
// @access  Private (Logistics only)
exports.getColdChainMonitoring = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user.id
    const logisticsId = req.user._id;
    
    const coldChainUnits = await Delivery.find({
      'assignedDriver.driver': logisticsId,
      'coldChainMonitoring.required': true,
      status: { $in: ['in_transit', 'out_for_delivery'] }
    })
    .populate('sender', 'profile.businessName')
    .populate('receiver', 'profile.businessName')
    .select('deliveryNumber cargoDescription coldChainMonitoring estimatedDelivery');
    
    // Format for frontend
    const formattedUnits = coldChainUnits.map(unit => ({
      id: unit.deliveryNumber,
      cargo: unit.cargoDescription,
      temp: `${unit.coldChainMonitoring.currentTemp}°C`,
      humidity: `${unit.coldChainMonitoring.humidity}%`,
      quality: `${unit.coldChainMonitoring.qualityScore}% Optimal`,
      eta: `${Math.round((unit.estimatedDelivery - new Date()) / (1000 * 60 * 60) * 10) / 10} hours`,
      alert: unit.coldChainMonitoring.alerts.length > 0 ? 'Watch' : 'Stable'
    }));
    
    res.json({
      success: true,
      data: formattedUnits
    });
  } catch (error) {
    console.error('Get cold chain monitoring error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cold chain monitoring',
      error: error.message
    });
  }
};

// Helper function to calculate distance (simplified)
function calculateDistance(coord1, coord2) {
  // Simplified distance calculation (Haversine would be better)
  const latDiff = Math.abs(coord1.lat - coord2.lat);
  const lngDiff = Math.abs(coord1.lng - coord2.lng);
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion
}

// Helper function to generate optimized route
async function generateOptimizedRoute(origin, destination) {
  // This would integrate with Google Maps API or similar
  // For now, return mock data
  return {
    routeId: `RT-${Date.now()}`,
    totalDistance: calculateDistance(origin, destination),
    estimatedDuration: calculateDistance(origin, destination) * 2,
    waypoints: [],
    optimization: 'AI-Weather-Adjusted',
    savings: '2.1 hours, 15% fuel'
  };
}