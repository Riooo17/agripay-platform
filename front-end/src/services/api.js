// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agripay-platform.onrender.com/api';

// Enhanced error handler
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error occurred' }));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Common headers with authentication
const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// ✅ FIXED: Get token from correct localStorage key
const getToken = () => {
  return localStorage.getItem('agripay_token');
};

// FINANCIAL INSTITUTION API - UPDATED TO MATCH YOUR BACKEND ROUTES
export const financialAPI = {
  // Dashboard Data - FIXED: Matches your /dashboard route
  getDashboardStats: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Loan Applications - FIXED: Matches your routes
  getLoanApplications: async (status = 'pending') => {
    const token = getToken();
    const queryParams = new URLSearchParams({ status }).toString();
    const response = await fetch(`${API_BASE_URL}/financial/loan-applications?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getLoanApplication: async (applicationId) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/loan-applications/${applicationId}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  approveLoan: async (applicationId, approvalData = {}) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/loan-applications/${applicationId}/approve`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(approvalData)
    });
    return handleResponse(response);
  },

  rejectLoan: async (applicationId, rejectionData = {}) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/loan-applications/${applicationId}/reject`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(rejectionData)
    });
    return handleResponse(response);
  },

  // Clients Management - FIXED: Matches your routes
  getClients: async (params = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/financial/clients?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getClient: async (clientId) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/clients/${clientId}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateClient: async (clientId, clientData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/clients/${clientId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(clientData)
    });
    return handleResponse(response);
  },

  // Payment Management - FIXED: Matches your routes
  requestPayment: async (clientId, paymentData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/clients/${clientId}/request-payment`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
  },

  getPaymentHistory: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/financial/payments?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Insurance Management - FIXED: Matches your routes
  getInsurancePolicies: async (status = '') => {
    const token = getToken();
    const url = status ? 
      `${API_BASE_URL}/financial/insurance-policies?status=${status}` : 
      `${API_BASE_URL}/financial/insurance-policies`;
    const response = await fetch(url, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  approveInsurance: async (policyId, approvalData = {}) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/insurance-policies/${policyId}/approve`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(approvalData)
    });
    return handleResponse(response);
  },

  rejectInsurance: async (policyId, rejectionData = {}) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/insurance-policies/${policyId}/reject`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(rejectionData)
    });
    return handleResponse(response);
  },

  // Portfolio Analytics - FIXED: Matches your routes
  getPortfolioAnalytics: async (period = 'monthly') => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/analytics/portfolio?period=${period}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getRiskAssessment: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/analytics/risk-assessment`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Reports - FIXED: Matches your routes
  generateReport: async (reportType, parameters = {}) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/reports/${reportType}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(parameters)
    });
    return handleResponse(response);
  },

  // Real-time Updates - FIXED: Matches your routes
  subscribeToUpdates: async (channels = []) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/updates/subscribe`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ channels })
    });
    return handleResponse(response);
  }
};

// SELLER API - UPDATED TO MATCH YOUR BACKEND ROUTES
export const sellerAPI = {
  // Dashboard Data - FIXED: Matches your /dashboard route
  getDashboardData: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Products Management - FIXED: Matches your routes
  getProducts: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/seller/products?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getProduct: async (productId) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/products/${productId}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  createProduct: async (productData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/products`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  updateProduct: async (productId, productData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/products/${productId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  deleteProduct: async (productId) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/products/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Orders Management - FIXED: Matches your routes
  getOrders: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/seller/orders?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (orderId, status) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/orders/${orderId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Analytics - FIXED: Matches your /analytics route
  getSalesAnalytics: async (timeRange = '7d') => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/analytics?range=${timeRange}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getInventoryStats: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/analytics/inventory`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Customer Management - FIXED: Matches your /customers route
  getCustomers: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/customers`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Quick Sales & Payments - Using orders endpoint
  processQuickSale: async (saleData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(saleData)
    });
    return handleResponse(response);
  },

  // Delivery Management - Using orders endpoint
  getDeliveries: async (status = '') => {
    const token = getToken();
    const url = status ? `${API_BASE_URL}/seller/orders?deliveryStatus=${status}` : `${API_BASE_URL}/seller/orders`;
    const response = await fetch(url, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateDeliveryStatus: async (deliveryId, status) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/orders/${deliveryId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ deliveryStatus: status })
    });
    return handleResponse(response);
  },

  assignDriver: async (deliveryId, driverData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/seller/orders/${deliveryId}/assign-driver`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(driverData)
    });
    return handleResponse(response);
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  logout: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(token)
    });
    return handleResponse(response);
  }
};

// Paystack API
export const paystackAPI = {
  initializePayment: async (paymentData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/paystack/initialize`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
  },

  verifyPayment: async (reference) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/paystack/verify/${reference}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getPaymentHistory: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/paystack/payments?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  }
};

// Expert API - COMPLETE INTEGRATION
export const expertAPI = {
  // Dashboard
  getDashboard: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/expert/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getAnalytics: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/expert/analytics`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Consultations
  getConsultations: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/expert/consultations?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateConsultation: async (consultationId, updates) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/expert/consultations/${consultationId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  provideAdvice: async (consultationId, adviceData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/expert/advice`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ consultationId, ...adviceData })
    });
    return handleResponse(response);
  },

  // Availability
  setAvailability: async (availability) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/expert/availability`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(availability)
    });
    return handleResponse(response);
  },

  // Clients
  getClients: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/expert/clients?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Knowledge Content
  getKnowledgeContent: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/expert/knowledge?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  createKnowledgeContent: async (contentData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/expert/knowledge`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(contentData)
    });
    return handleResponse(response);
  },

  updateKnowledgeContent: async (contentId, updates) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/expert/knowledge/${contentId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  }
};

// Buyer API
export const buyerAPI = {
  getDashboardData: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/buyer/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getProducts: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/buyer/products?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getOrders: async (status = '') => {
    const token = getToken();
    const url = status ? `${API_BASE_URL}/buyer/orders?status=${status}` : `${API_BASE_URL}/buyer/orders`;
    const response = await fetch(url, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getNotifications: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/buyer/notifications`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  placeOrder: async (orderData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/buyer/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
  }
};

// LOGISTICS API - COMPREHENSIVE ENDPOINTS
export const logisticsAPI = {
  // Dashboard Data
  getDashboard: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Shipments Management
  getShipments: async (status = '') => {
    const token = getToken();
    const url = status ? `${API_BASE_URL}/logistics/shipments?status=${status}` : `${API_BASE_URL}/logistics/shipments`;
    const response = await fetch(url, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getShipment: async (shipmentId) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/shipments/${shipmentId}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateShipment: async (shipmentId, data) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/shipments/${shipmentId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  createShipment: async (shipmentData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/shipments`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(shipmentData)
    });
    return handleResponse(response);
  },

  // Fleet Management
  getVehicles: async (status = '') => {
    const token = getToken();
    const url = status ? `${API_BASE_URL}/logistics/vehicles?status=${status}` : `${API_BASE_URL}/logistics/vehicles`;
    const response = await fetch(url, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getVehicle: async (vehicleId) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/vehicles/${vehicleId}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateVehicle: async (vehicleId, data) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/vehicles/${vehicleId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  createVehicle: async (vehicleData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/vehicles`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(vehicleData)
    });
    return handleResponse(response);
  },

  // Route Optimization
  optimizeRoutes: async (routeData = {}) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/routes/optimize`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(routeData)
    });
    return handleResponse(response);
  },

  getOptimizedRoutes: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/routes/optimized`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Cold Chain Management
  getColdChainUnits: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/cold-chain/units`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  activateColdChain: async (unitData = {}) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/cold-chain/activate`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(unitData)
    });
    return handleResponse(response);
  },

  updateColdChainUnit: async (unitId, data) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/cold-chain/units/${unitId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // AI Predictions & Analytics
  getPredictions: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/ai/predictions`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  generatePrediction: async (predictionData = {}) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/ai/generate-prediction`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(predictionData)
    });
    return handleResponse(response);
  },

  // Rural Logistics
  optimizeRuralRoutes: async (ruralData = {}) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/rural/optimize`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(ruralData)
    });
    return handleResponse(response);
  },

  // Crisis Management
  activateCrisisProtocol: async (crisisData = {}) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/crisis/activate`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(crisisData)
    });
    return handleResponse(response);
  },

  // Real-time Tracking
  getLiveTracking: async (shipmentId) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/tracking/${shipmentId}/live`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateLocation: async (vehicleId, locationData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/vehicles/${vehicleId}/location`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(locationData)
    });
    return handleResponse(response);
  },

  // Payments & Finance
  getPaymentHistory: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/logistics/payments?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updatePaymentStatus: async (paymentId, status) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/payments/${paymentId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Reports & Analytics
  getReports: async (reportType, period = 'weekly') => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logistics/reports/${reportType}?period=${period}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  }
};

// Farmer API
export const farmerAPI = {
  getDashboardData: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/farmer/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getProducts: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/farmer/products`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  createProduct: async (productData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/farmer/products`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  getOrders: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/farmer/orders`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  }
};

// Health Check with retry mechanism
export const checkAPIHealth = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return await handleResponse(response);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// API Status Monitor
export const apiMonitor = {
  isOnline: async () => {
    try {
      await checkAPIHealth(1);
      return true;
    } catch {
      return false;
    }
  },

  getLatency: async () => {
    const start = Date.now();
    try {
      await checkAPIHealth(1);
      return Date.now() - start;
    } catch {
      return -1;
    }
  }
};

export default {
  auth: authAPI,
  paystack: paystackAPI,
  expert: expertAPI,
  buyer: buyerAPI,
  logistics: logisticsAPI,
  farmer: farmerAPI,
  financial: financialAPI,
  seller: sellerAPI,
  health: checkAPIHealth,
  monitor: apiMonitor
};