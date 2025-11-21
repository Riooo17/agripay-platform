// src/services/logisticsService.js
import { logisticsAPI } from './api';

export const logisticsService = {
  async loadDashboardData() {
    try {
      console.log('🔄 Loading logistics dashboard data...');
      
      // ✅ TRY real API first, fallback to mock data if endpoints don't exist
      try {
        const [dashboard, shipments, vehicles] = await Promise.all([
          logisticsAPI.getDashboard(),
          logisticsAPI.getShipments('active'),
          logisticsAPI.getVehicles()
        ]);
        
        console.log('✅ REAL API data loaded:', { dashboard, shipments, vehicles });
        
        return {
          dashboard: dashboard.data || dashboard,
          shipments: shipments.data || shipments,
          vehicles: vehicles.data || vehicles,
          _isMock: false
        };
        
      } catch (apiError) {
        console.log('🔶 API endpoints not ready, using mock data:', apiError.message);
        return getMockDashboardData();
      }
      
    } catch (error) {
      console.error('❌ Error loading logistics data:', error);
      // Fallback to mock data
      return getMockDashboardData();
    }
  },

  async refreshShipments(status = '') {
    try {
      const shipments = await logisticsAPI.getShipments(status);
      return shipments.data || shipments;
    } catch (error) {
      console.log('🔶 Using mock shipments data');
      return getMockShipments();
    }
  },

  async updateShipmentStatus(shipmentId, status) {
    try {
      return await logisticsAPI.updateShipment(shipmentId, { status });
    } catch (error) {
      console.log('🔶 Mock: Updating shipment status');
      return { success: true, message: 'Status updated (mock)' };
    }
  },

  async optimizeRoutes() {
    try {
      return await logisticsAPI.optimizeRoutes();
    } catch (error) {
      console.log('🔶 Mock: Route optimization');
      return { success: true, message: 'Routes optimized (mock)' };
    }
  },

  async activateColdChain() {
    try {
      return await logisticsAPI.activateColdChain();
    } catch (error) {
      console.log('🔶 Mock: Cold chain activated');
      return { success: true, message: 'Cold chain activated (mock)' };
    }
  },

  async scheduleMaintenance(vehicleId) {
    try {
      return await logisticsAPI.updateVehicle(vehicleId, { status: 'maintenance' });
    } catch (error) {
      console.log('🔶 Mock: Maintenance scheduled');
      return { success: true, message: 'Maintenance scheduled (mock)' };
    }
  },

  async activateVehicle(vehicleId) {
    try {
      return await logisticsAPI.updateVehicle(vehicleId, { status: 'active' });
    } catch (error) {
      console.log('🔶 Mock: Vehicle activated');
      return { success: true, message: 'Vehicle activated (mock)' };
    }
  },

  async generatePrediction() {
    try {
      return await logisticsAPI.generatePrediction();
    } catch (error) {
      console.log('🔶 Mock: Prediction generated');
      return { success: true, message: 'Prediction generated (mock)' };
    }
  }
};

// ✅ MOCK DATA FOR WHEN APIS AREN'T READY
const getMockDashboardData = () => {
  console.log('🎭 Using mock dashboard data');
  return {
    dashboard: {
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
      ]
    },
    shipments: getMockShipments(),
    vehicles: getMockVehicles(),
    _isMock: true
  };
};

const getMockShipments = () => [
  { 
    id: 'DR-2847', 
    trackingNumber: 'DR-2847',
    customer: { name: 'Fresh Farms Ltd' },
    status: 'in_transit', 
    amount: 8500, 
    origin: 'Kiambu', 
    destination: 'Nairobi CBD',
    currentLocation: 'Along Mombasa Road'
  },
  { 
    id: 'DR-2846', 
    trackingNumber: 'DR-2846',
    customer: { name: 'Nairobi Market Hub' },
    status: 'pending', 
    amount: 12000, 
    origin: 'Thika', 
    destination: 'Westlands',
    currentLocation: 'Warehouse'
  },
  { 
    id: 'DR-2845', 
    trackingNumber: 'DR-2845',
    customer: { name: 'Green Valley Produce' },
    status: 'completed', 
    amount: 6700, 
    origin: 'Limuru', 
    destination: 'Karen',
    currentLocation: 'Delivered'
  }
];

const getMockVehicles = () => [
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
  },
  { 
    id: 2, 
    make: 'Isuzu', 
    model: 'NPR',
    licensePlate: 'KAB 456B',
    status: 'maintenance', 
    driver: { name: 'Sarah Mwende' }, 
    currentLocation: 'Depot',
    currentCargo: 'Dairy Products',
    eta: 'N/A'
  },
  { 
    id: 3, 
    make: 'Mitsubishi', 
    model: 'Fuso',
    licensePlate: 'KCE 789C',
    status: 'active', 
    driver: { name: 'Mike Ochieng' }, 
    currentLocation: 'Mombasa Road',
    currentCargo: 'Grains',
    eta: '3 hours'
  }
];