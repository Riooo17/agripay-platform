import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class FarmerApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
    });

    // 🚀 FIX: Use correct token key 'agripay_token'
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('agripay_token'); // ✅ FIXED
        console.log('🔄 API Call:', config.method?.toUpperCase(), config.url);
        console.log('   - Token exists:', !!token);
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('   - Authorization header set');
        } else {
          console.log('   - No token found in localStorage');
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle responses
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ API Success:', response.config.url, response.status);
        return response;
      },
      (error) => {
        console.error('❌ API Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message
        });
        
        if (error.response?.status === 401) {
          console.log('🔐 401 Unauthorized - triggering logout');
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  handleUnauthorized() {
    console.log('🚪 Handling unauthorized - clearing storage');
    localStorage.removeItem('agripay_token'); // ✅ FIXED
    localStorage.removeItem('agripay_user');  // ✅ FIXED
    window.location.href = '/auth';
  }

  // ✅ DASHBOARD DATA
  async getDashboard() {
    try {
      console.log('📊 Fetching dashboard data...');
      const response = await this.api.get('/farmer/dashboard');
      console.log('🎉 Dashboard loaded successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('💥 Dashboard load failed:', error);
      throw new Error(this.getErrorMessage(error, 'Failed to load dashboard'));
    }
  }

  // ✅ PRODUCTS - FULL CRUD
  async getProducts() {
    try {
      const response = await this.api.get('/farmer/products');
      return response.data;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Failed to load products'));
    }
  }

  async createProduct(productData) {
    try {
      const response = await this.api.post('/farmer/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Failed to create product'));
    }
  }

  async updateProduct(productId, productData) {
    try {
      const response = await this.api.put(`/farmer/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Failed to update product'));
    }
  }

  async deleteProduct(productId) {
    try {
      const response = await this.api.delete(`/farmer/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Failed to delete product'));
    }
  }

  // ✅ ORDERS - FULL MANAGEMENT
  async getOrders(status = 'all') {
    try {
      const response = await this.api.get(`/farmer/orders?status=${status}`);
      return response.data;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Failed to load orders'));
    }
  }

  async getOrderDetails(orderId) {
    try {
      const response = await this.api.get(`/farmer/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Failed to load order details'));
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await this.api.patch(`/farmer/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Failed to update order status'));
    }
  }

  // ✅ PROFILE MANAGEMENT
  async getProfile() {
    try {
      const response = await this.api.get('/farmer/profile');
      return response.data;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Failed to load profile'));
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await this.api.put('/farmer/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Failed to update profile'));
    }
  }

  // ✅ FINANCIAL
  async getTransactions() {
    try {
      const response = await this.api.get('/farmer/transactions');
      return response.data;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Failed to load transactions'));
    }
  }

  async requestPayout(amount) {
    try {
      const response = await this.api.post('/farmer/payout-request', { amount });
      return response.data;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Failed to request payout'));
    }
  }

  // ✅ ERROR HANDLER
  getErrorMessage(error, defaultMessage) {
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      return 'Cannot connect to server. Please ensure backend is running on http://localhost:5000';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return defaultMessage;
  }
}

export default new FarmerApiService();