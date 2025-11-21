// src/services/financialApi.js
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

// Financial Institution API
export const financialAPI = {
  // Dashboard Data
  getDashboardStats: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/dashboard`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getAnalytics: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/analytics`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Loan Applications
  getLoanApplications: async (status = '') => {
    const token = getToken();
    const url = status ? `${API_BASE_URL}/financial/loan-applications?status=${status}` : `${API_BASE_URL}/financial/loan-applications`;
    const response = await fetch(url, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getPendingLoans: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/loan-applications?status=pending`, {
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

  // Clients Management
  getClients: async (params = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/financial/clients?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getClientPortfolio: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/clients/portfolio`, {
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

  requestPayment: async (clientId, paymentData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/clients/${clientId}/request-payment`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(paymentData)
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

  // Record payment (for Paystack success)
  recordPayment: async (paymentData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/payments/record`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
  },

  // Insurance Management
  getInsurancePolicies: async (status = '') => {
    const token = getToken();
    const url = status ? `${API_BASE_URL}/financial/insurance-policies?status=${status}` : `${API_BASE_URL}/financial/insurance-policies`;
    const response = await fetch(url, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getPendingInsurance: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/insurance-policies?status=pending`, {
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

  // Payment Collections
  getPaymentDueSoon: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/payments/due-soon`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  getPaymentHistory: async (filters = {}) => {
    const token = getToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/financial/payments/history?${queryParams}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Reports & Analytics
  getReports: async (reportType, period = 'monthly') => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/reports/${reportType}?period=${period}`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  generatePortfolioReport: async (reportData = {}) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/financial/reports/portfolio`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(reportData)
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
  financial: financialAPI,
  health: checkAPIHealth,
  monitor: apiMonitor
};