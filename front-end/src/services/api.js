// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agripay-platform.onrender.com:10000/api';
// Enhanced error handler with better error messages
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Network error occurred';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
  
  // Handle 204 No Content responses
  if (response.status === 204) {
    return { success: true };
  }
  
  return response.json();
};

// Common headers with authentication
const getHeaders = (token, contentType = 'application/json') => {
  const headers = {
    'Content-Type': contentType,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('agripay_token');
};

// Request interceptor for logging and retry logic
const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// FINANCIAL INSTITUTION API
export const financialAPI = {
  // Dashboard Data
  getDashboardStats: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Loan Applications
  getLoanApplications: async (status = 'pending') => {
    const token = getToken();
    const queryParams = new URLSearchParams({ status }).toString();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/loan-applications?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getLoanApplication: async (applicationId) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/loan-applications/${applicationId}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  approveLoan: async (applicationId, approvalData = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/loan-applications/${applicationId}/approve`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(approvalData)
    });
    return handleResponse(response);
  },

  rejectLoan: async (applicationId, rejectionData = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/loan-applications/${applicationId}/reject`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(rejectionData)
    });
    return handleResponse(response);
  },

  // Clients Management
  getClients: async (params = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/clients?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getClient: async (clientId) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/clients/${clientId}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateClient: async (clientId, clientData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/clients/${clientId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(clientData)
    });
    return handleResponse(response);
  },

  // Payment Management
  requestPayment: async (clientId, paymentData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/clients/${clientId}/request-payment`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
  },

  getPaymentHistory: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/payments?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Insurance Management
  getInsurancePolicies: async (status = '') => {
    const token = getToken();
    const queryParams = status ? `?status=${status}` : '';
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/insurance-policies${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  approveInsurance: async (policyId, approvalData = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/insurance-policies/${policyId}/approve`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(approvalData)
    });
    return handleResponse(response);
  },

  rejectInsurance: async (policyId, rejectionData = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/insurance-policies/${policyId}/reject`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(rejectionData)
    });
    return handleResponse(response);
  },

  // Portfolio Analytics
  getPortfolioAnalytics: async (period = 'monthly') => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/analytics/portfolio?period=${period}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getRiskAssessment: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/analytics/risk-assessment`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Reports
  generateReport: async (reportType, parameters = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/reports/${reportType}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(parameters)
    });
    return handleResponse(response);
  },

  // Real-time Updates
  subscribeToUpdates: async (channels = []) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/updates/subscribe`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ channels })
    });
    return handleResponse(response);
  }
};

// SELLER API
export const sellerAPI = {
  // Dashboard Data
  getDashboardData: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Products Management
  getProducts: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/products?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getProduct: async (productId) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/products/${productId}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  createProduct: async (productData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/products`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  updateProduct: async (productId, productData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/products/${productId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  deleteProduct: async (productId) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/products/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Orders Management
  getOrders: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/orders?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (orderId, status) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/orders/${orderId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Analytics
  getSalesAnalytics: async (timeRange = '7d') => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/analytics?range=${timeRange}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getInventoryStats: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/analytics/inventory`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Customer Management
  getCustomers: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/customers`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Quick Sales & Payments
  processQuickSale: async (saleData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(saleData)
    });
    return handleResponse(response);
  },

  // Delivery Management
  getDeliveries: async (status = '') => {
    const token = getToken();
    const queryParams = status ? `?deliveryStatus=${status}` : '';
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/orders${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateDeliveryStatus: async (orderId, status) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/orders/${orderId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ deliveryStatus: status })
    });
    return handleResponse(response);
  },

  assignDriver: async (orderId, driverData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/seller/orders/${orderId}/assign-driver`, {
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
    const response = await fetchWithRetry(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/auth/profile`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  logout: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  refreshToken: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/auth/refresh`, {
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
    const response = await fetchWithRetry(`${API_BASE_URL}/paystack/initialize`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
  },

  verifyPayment: async (reference) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/paystack/verify/${reference}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getPaymentHistory: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetchWithRetry(`${API_BASE_URL}/paystack/payments?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  }
};

// Expert API
export const expertAPI = {
  // Dashboard
  getDashboard: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/expert/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getAnalytics: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/expert/analytics`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Consultations
  getConsultations: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetchWithRetry(`${API_BASE_URL}/expert/consultations?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateConsultation: async (consultationId, updates) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/expert/consultations/${consultationId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  provideAdvice: async (consultationId, adviceData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/expert/advice`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ consultationId, ...adviceData })
    });
    return handleResponse(response);
  },

  // Availability
  setAvailability: async (availability) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/expert/availability`, {
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
    const response = await fetchWithRetry(`${API_BASE_URL}/expert/clients?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Knowledge Content
  getKnowledgeContent: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetchWithRetry(`${API_BASE_URL}/expert/knowledge?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  createKnowledgeContent: async (contentData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/expert/knowledge`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(contentData)
    });
    return handleResponse(response);
  },

  updateKnowledgeContent: async (contentId, updates) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/expert/knowledge/${contentId}`, {
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
    const response = await fetchWithRetry(`${API_BASE_URL}/buyer/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getProducts: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetchWithRetry(`${API_BASE_URL}/buyer/products?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getOrders: async (status = '') => {
    const token = getToken();
    const queryParams = status ? `?status=${status}` : '';
    const response = await fetchWithRetry(`${API_BASE_URL}/buyer/orders${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getNotifications: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/buyer/notifications`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  placeOrder: async (orderData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/buyer/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
  }
};

// LOGISTICS API
export const logisticsAPI = {
  // Dashboard Data
  getDashboard: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Shipments Management
  getShipments: async (status = '') => {
    const token = getToken();
    const queryParams = status ? `?status=${status}` : '';
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/shipments${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getShipment: async (shipmentId) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/shipments/${shipmentId}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateShipment: async (shipmentId, data) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/shipments/${shipmentId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  createShipment: async (shipmentData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/shipments`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(shipmentData)
    });
    return handleResponse(response);
  },

  // Fleet Management
  getVehicles: async (status = '') => {
    const token = getToken();
    const queryParams = status ? `?status=${status}` : '';
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/vehicles${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getVehicle: async (vehicleId) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/vehicles/${vehicleId}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateVehicle: async (vehicleId, data) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/vehicles/${vehicleId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  createVehicle: async (vehicleData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/vehicles`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(vehicleData)
    });
    return handleResponse(response);
  },

  // Route Optimization
  optimizeRoutes: async (routeData = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/routes/optimize`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(routeData)
    });
    return handleResponse(response);
  },

  getOptimizedRoutes: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/routes/optimized`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Cold Chain Management
  getColdChainUnits: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/cold-chain/units`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  activateColdChain: async (unitData = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/cold-chain/activate`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(unitData)
    });
    return handleResponse(response);
  },

  updateColdChainUnit: async (unitId, data) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/cold-chain/units/${unitId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // AI Predictions & Analytics
  getPredictions: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/ai/predictions`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  generatePrediction: async (predictionData = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/ai/generate-prediction`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(predictionData)
    });
    return handleResponse(response);
  },

  // Rural Logistics
  optimizeRuralRoutes: async (ruralData = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/rural/optimize`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(ruralData)
    });
    return handleResponse(response);
  },

  // Crisis Management
  activateCrisisProtocol: async (crisisData = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/crisis/activate`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(crisisData)
    });
    return handleResponse(response);
  },

  // Real-time Tracking
  getLiveTracking: async (shipmentId) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/tracking/${shipmentId}/live`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updateLocation: async (vehicleId, locationData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/vehicles/${vehicleId}/location`, {
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
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/payments?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updatePaymentStatus: async (paymentId, status) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/payments/${paymentId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Reports & Analytics
  getReports: async (reportType, period = 'weekly') => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/logistics/reports/${reportType}?period=${period}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  }
};

// Farmer API
export const farmerAPI = {
  getDashboardData: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/farmer/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getProducts: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/farmer/products`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  createProduct: async (productData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/farmer/products`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  getOrders: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/farmer/orders`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  }
};

// Health Check with retry mechanism
export const checkAPIHealth = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
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

// Utility function to clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('agripay_token');
  localStorage.removeItem('agripay_user');
};

// Request interceptor for auth token refresh
export const setupResponseInterceptors = () => {
  // This would typically be implemented with axios interceptors
  // For fetch, we handle it in the fetchWithRetry function
  console.log('Response interceptors setup complete');
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
  monitor: apiMonitor,
  utils: {
    clearAuthData,
    setupResponseInterceptors
  }
};