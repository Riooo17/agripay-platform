const express = require('express');
const router = express.Router();

// Universal API handler - catches ALL undefined routes
router.all('*', async (req, res) => {
  const path = req.path;
  const method = req.method;
  const data = req.body;
  const user = req.user; // From auth middleware

  try {
    // Generate intelligent response based on the route
    const response = generateUniversalResponse(path, method, data, user);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Universal API error',
      error: error.message
    });
  }
});

// Analyze route and generate appropriate response
function generateUniversalResponse(path, method, data, user) {
  const routeInfo = analyzeRoute(path, method);
  
  return {
    success: true,
    message: `🔧 Universal API: ${routeInfo.description}`,
    data: generateMockData(routeInfo, data, user),
    mock: true,
    endpoint: `${method} ${path}`,
    timestamp: new Date().toISOString(),
    note: 'This is intelligent mock data. Real endpoint coming soon!'
  };
}

// Analyze what the route is trying to do
function analyzeRoute(path, method) {
  const segments = path.split('/').filter(segment => segment && segment !== 'api');
  
  // Detect resource and action
  const resource = segments[0] || 'unknown';
  const id = segments[1] || null;
  const action = segments[2] || null;

  return {
    resource,
    id, 
    action,
    method,
    description: generateDescription(resource, method, id, action)
  };
}

function generateDescription(resource, method, id, action) {
  const actions = {
    'GET': id ? `Get ${resource} details` : `List ${resource}s`,
    'POST': `Create new ${resource}`,
    'PUT': `Update ${resource}`,
    'DELETE': `Delete ${resource}`,
    'PATCH': `Modify ${resource}`
  };
  
  return actions[method] || `${method} operation on ${resource}`;
}

function generateMockData(routeInfo, data, user) {
  const { resource, method, id, action } = routeInfo;
  
  // Resource-specific mock data generators
  const mockGenerators = {
    'farmers': () => generateFarmerData(method, id, data),
    'buyers': () => generateBuyerData(method, id, data),
    'experts': () => generateExpertData(method, id, data),
    'logistics': () => generateLogisticsData(method, id, data),
    'supplies': () => generateSuppliesData(method, id, data),
    'products': () => generateProductData(method, id, data),
    'orders': () => generateOrderData(method, id, data),
    'shipments': () => generateShipmentData(method, id, data),
    'crops': () => generateCropData(method, id, data),
    'analytics': () => generateAnalyticsData(method, id, data),
    'inventory': () => generateInventoryData(method, id, data),
    'market': () => generateMarketData(method, id, data)
  };

  const generator = mockGenerators[resource] || generateGenericData;
  return generator(method, id, data, user);
}

// Resource-specific mock data generators
function generateFarmerData(method, id, data) {
  if (method === 'GET' && id) {
    return {
      id: id || 'farmer_001',
      name: 'John Kamau',
      location: 'Nakuru, Kenya',
      farmSize: 5.2,
      crops: ['Maize', 'Beans', 'Tomatoes'],
      rating: 4.8,
      joinedDate: '2024-01-15'
    };
  }
  
  return {
    farmers: [
      {
        id: 'farmer_001',
        name: 'John Kamau',
        location: 'Nakuru, Kenya',
        farmSize: 5.2,
        crops: ['Maize', 'Beans', 'Tomatoes'],
        rating: 4.8
      },
      {
        id: 'farmer_002', 
        name: 'Mary Wanjiku',
        location: 'Meru, Kenya',
        farmSize: 3.8,
        crops: ['Coffee', 'Bananas'],
        rating: 4.9
      }
    ],
    total: 2,
    page: 1,
    limit: 10
  };
}

function generateBuyerData(method, id, data) {
  if (method === 'GET' && id) {
    return {
      id: id || 'buyer_001',
      name: 'FreshMart Supermarket',
      location: 'Nairobi, Kenya',
      businessType: 'Retail',
      products: ['Vegetables', 'Fruits', 'Grains'],
      rating: 4.7
    };
  }
  
  return {
    buyers: [
      {
        id: 'buyer_001',
        name: 'FreshMart Supermarket',
        location: 'Nairobi, Kenya', 
        businessType: 'Retail',
        rating: 4.7
      },
      {
        id: 'buyer_002',
        name: 'Export Partners Ltd',
        location: 'Mombasa, Kenya',
        businessType: 'Export',
        rating: 4.9
      }
    ],
    total: 2
  };
}

function generateExpertData(method, id, data) {
  return {
    experts: [
      {
        id: 'expert_001',
        name: 'Dr. Sarah Chen',
        specialization: 'Crop Science',
        experience: 12,
        rating: 4.9,
        consultations: 245
      }
    ]
  };
}

function generateLogisticsData(method, id, data) {
  return {
    logistics: [
      {
        id: 'logistics_001',
        company: 'AgriLogistics Kenya',
        services: ['Transport', 'Cold Chain', 'Storage'],
        rating: 4.6
      }
    ]
  };
}

function generateSuppliesData(method, id, data) {
  return {
    suppliers: [
      {
        id: 'supplier_001',
        name: 'FarmInputs Ltd',
        products: ['Seeds', 'Fertilizers', 'Tools'],
        rating: 4.5
      }
    ]
  };
}

function generateProductData(method, id, data) {
  if (method === 'GET' && id) {
    return {
      id: id || 'prod_001',
      name: 'Organic Fertilizer',
      description: 'High-quality organic fertilizer for all crops',
      price: 45.00,
      category: 'Fertilizers',
      inStock: true,
      supplier: 'GreenGrowth Supplies',
      rating: 4.5
    };
  }
  
  return {
    products: [
      {
        id: 'prod_001',
        name: 'Organic Fertilizer',
        price: 45.00,
        category: 'Fertilizers',
        inStock: true,
        rating: 4.5
      },
      {
        id: 'prod_002',
        name: 'Maize Seeds - Hybrid',
        price: 25.00,
        category: 'Seeds',
        inStock: true,
        rating: 4.7
      },
      {
        id: 'prod_003',
        name: 'Garden Sprayer',
        price: 15.00,
        category: 'Equipment',
        inStock: false,
        rating: 4.3
      }
    ],
    total: 3,
    page: 1
  };
}

function generateShipmentData(method, id, data) {
  if (method === 'GET' && id) {
    return {
      id: id || 'ship_001',
      from: 'Nakuru',
      to: 'Nairobi',
      status: 'in_transit',
      estimatedDelivery: '2024-11-14T10:00:00Z',
      carrier: 'AgriLogistics Kenya'
    };
  }
  
  return {
    shipments: [
      {
        id: 'ship_001',
        from: 'Nakuru',
        to: 'Nairobi',
        status: 'in_transit',
        estimatedDelivery: '2024-11-14T10:00:00Z'
      },
      {
        id: 'ship_002',
        from: 'Meru',
        to: 'Mombasa',
        status: 'delivered',
        deliveredAt: '2024-11-12T14:30:00Z'
      }
    ],
    total: 2
  };
}

function generateOrderData(method, id, data) {
  return {
    orders: [
      {
        id: 'order_001',
        product: 'Organic Tomatoes',
        quantity: 500,
        price: 40000,
        status: 'confirmed',
        deliveryDate: '2024-11-15'
      }
    ]
  };
}

function generateCropData(method, id, data) {
  return {
    crops: [
      {
        id: 'crop_001',
        name: 'Maize',
        plantingDate: '2024-10-01',
        harvestDate: '2025-02-15',
        status: 'growing'
      }
    ]
  };
}

function generateAnalyticsData(method, id, data) {
  return {
    metrics: {
      totalSales: 1245000,
      activeFarmers: 156,
      completedOrders: 89,
      revenueGrowth: '15%'
    }
  };
}

function generateInventoryData(method, id, data) {
  return {
    inventory: [
      {
        product: 'Maize Seeds',
        quantity: 2450,
        lowStock: false
      },
      {
        product: 'NPK Fertilizer',
        quantity: 120,
        lowStock: true
      }
    ]
  };
}

function generateMarketData(method, id, data) {
  return {
    prices: [
      {
        commodity: 'Maize',
        price: 50,
        unit: 'kg',
        trend: 'up'
      },
      {
        commodity: 'Tomatoes',
        price: 80,
        unit: 'kg',
        trend: 'stable'
      }
    ]
  };
}

function generateGenericData(method, id, data, user) {
  return {
    message: `Handling ${method} request`,
    resource: 'generic',
    user: user ? { id: user._id, role: user.role } : null,
    timestamp: new Date().toISOString()
  };
}

module.exports = router;
