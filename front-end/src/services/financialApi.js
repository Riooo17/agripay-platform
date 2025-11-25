// src/services/financialApi.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agripay-platform.onrender.com/api';

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

// Financial Institution API
export const financialAPI = {
  // Dashboard Data - FIXED: Removed duplicate /api from URLs
  getDashboardStats: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getAnalytics: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/analytics`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Loan Applications - FIXED: URL consistency
  getLoanApplications: async (status = '') => {
    const token = getToken();
    const queryParams = status ? `?status=${status}` : '';
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/loan-applications${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getPendingLoans: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/loan-applications?status=pending`, {
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

  // Clients Management - FIXED: URL consistency
  getClients: async (params = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${API_BASE_URL}/financial/clients?${queryParams}` : `${API_BASE_URL}/financial/clients`;
    const response = await fetchWithRetry(url, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getClientPortfolio: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/clients/portfolio`, {
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

  requestPayment: async (clientId, paymentData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/clients/${clientId}/request-payment`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(paymentData)
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

  // Record payment (for Paystack success)
  recordPayment: async (paymentData) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/payments/record`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
  },

  // Insurance Management - FIXED: URL consistency
  getInsurancePolicies: async (status = '') => {
    const token = getToken();
    const queryParams = status ? `?status=${status}` : '';
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/insurance-policies${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getPendingInsurance: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/insurance-policies?status=pending`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getInsurancePolicy: async (policyId) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/insurance-policies/${policyId}`, {
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

  // Payment Collections - FIXED: URL consistency
  getPaymentDueSoon: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/payments/due-soon`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getPaymentHistory: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${API_BASE_URL}/financial/payments/history?${queryParams}` : `${API_BASE_URL}/financial/payments/history`;
    const response = await fetchWithRetry(url, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getPayment: async (paymentId) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/payments/${paymentId}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  updatePaymentStatus: async (paymentId, status) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/payments/${paymentId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Reports & Analytics - FIXED: URL consistency
  getReports: async (reportType, period = 'monthly') => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/reports/${reportType}?period=${period}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  generatePortfolioReport: async (reportData = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/reports/portfolio`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(reportData)
    });
    return handleResponse(response);
  },

  generateRiskReport: async (riskData = {}) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/reports/risk-assessment`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(riskData)
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

  // Real-time Updates
  subscribeToUpdates: async (channels = []) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/updates/subscribe`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ channels })
    });
    return handleResponse(response);
  },

  // Notifications
  getNotifications: async () => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/notifications`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  markNotificationAsRead: async (notificationId) => {
    const token = getToken();
    const response = await fetchWithRetry(`${API_BASE_URL}/financial/notifications/${notificationId}/read`, {
      method: 'PUT',
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

// Financial-specific utility functions
export const financialUtils = {
  formatCurrency: (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  calculateInterest: (principal, rate, time) => {
    return principal * (rate / 100) * time;
  },

  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

export default {
  financial: financialAPI,
  health: checkAPIHealth,
  monitor: apiMonitor,
  utils: financialUtils,
  clearAuthData
};