import { sellerAPI } from './api';

// Mock data fallback for development
const getMockProducts = () => {
  return [
    { 
      id: 1, 
      name: 'Hybrid Maize Seeds DH04', 
      category: 'Seeds', 
      price: 1500, 
      stock: 45, 
      lowStock: 10, 
      image: 'https://images.unsplash.com/photo-1594377155068-2f563a5d7c2a?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 127,
      description: 'High-yield hybrid maize seeds suitable for Kenyan climate. Drought resistant with 95% germination rate.',
      status: 'active',
      tags: ['Popular', 'High Yield'],
      createdAt: '2024-01-01'
    },
    { 
      id: 2, 
      name: 'NPK Fertilizer 50kg', 
      category: 'Fertilizers', 
      price: 3500, 
      stock: 8, 
      lowStock: 15, 
      image: 'https://images.unsplash.com/photo-1627905323672-5de9d81d5cde?w=400&h=300&fit=crop',
      rating: 4.6,
      reviews: 89,
      description: 'Balanced NPK fertilizer for all crops. Improves soil fertility and crop yield significantly.',
      status: 'active',
      tags: ['Organic', 'Fast Acting'],
      createdAt: '2024-01-05'
    },
    { 
      id: 3, 
      name: 'Professional Garden Sprayer 5L', 
      category: 'Equipment', 
      price: 2500, 
      stock: 22, 
      lowStock: 5, 
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      rating: 4.9,
      reviews: 203,
      description: 'Professional garden sprayer with adjustable nozzle. Perfect for pesticides and liquid fertilizers.',
      status: 'active',
      tags: ['Professional', 'Adjustable'],
      createdAt: '2024-01-10'
    },
    { 
      id: 4, 
      name: 'Tomato Seeds F1 Hybrid', 
      category: 'Seeds', 
      price: 800, 
      stock: 3, 
      lowStock: 10, 
      image: 'https://images.unsplash.com/photo-1594377155068-2f563a5d7c2a?w=400&h=300&fit=crop',
      rating: 4.7,
      reviews: 156,
      description: 'Disease-resistant tomato seeds for high yield. Perfect for commercial farming.',
      status: 'active',
      tags: ['Disease Resistant', 'Commercial'],
      createdAt: '2024-01-08'
    }
  ];
};

const getMockOrders = () => {
  return [
    { 
      id: 'ORD-001', 
      customer: 'John Kamau', 
      product: 'Maize Seeds Premium', 
      amount: 3000, 
      status: 'pending', 
      date: '2024-01-15',
      items: 2,
      customerPhone: '+254712345678',
      deliveryAddress: '123 Farm Road, Kiambu'
    },
    { 
      id: 'ORD-002', 
      customer: 'Mary Wanjiku', 
      product: 'NPK Fertilizer 50kg', 
      amount: 7000, 
      status: 'shipped', 
      date: '2024-01-14',
      items: 2,
      customerPhone: '+254723456789',
      deliveryAddress: '456 Green Valley, Nakuru'
    },
    { 
      id: 'ORD-003', 
      customer: 'David Ochieng', 
      product: 'Water Pump 2HP', 
      amount: 18500, 
      status: 'delivered', 
      date: '2024-01-13',
      items: 1,
      customerPhone: '+254734567890',
      deliveryAddress: '789 Lake View, Kisumu'
    }
  ];
};

export const productService = {
  // Get all products with optional filtering
  fetchProducts: async (filters = {}) => {
    try {
      console.log('📦 Fetching products from backend...', filters);
      const response = await sellerAPI.getProducts(filters);
      console.log('✅ Products fetched successfully:', response);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to fetch products, using mock data:', error);
      // Check if it's a 404 error (endpoint doesn't exist yet)
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log('ℹ️  Seller products endpoint not implemented yet, using mock data');
      }
      return getMockProducts();
    }
  },

  // Get single product
  fetchProduct: async (productId) => {
    try {
      console.log('📦 Fetching product:', productId);
      const response = await sellerAPI.getProduct(productId);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to fetch product:', error);
      // Find in mock data as fallback
      return getMockProducts().find(p => p.id === parseInt(productId)) || null;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      console.log('🆕 Creating product:', productData);
      
      // Handle image upload
      if (productData.imageFile) {
        productData.image = productData.imagePreview || 'https://images.unsplash.com/photo-1594377155068-2f563a5d7c2a?w=400&h=300&fit=crop';
        delete productData.imageFile;
        delete productData.imagePreview;
      }

      const response = await sellerAPI.createProduct(productData);
      console.log('✅ Product created successfully:', response);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to create product:', error);
      
      // Check if it's a 404 error (endpoint doesn't exist yet)
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log('ℹ️  Seller create product endpoint not implemented yet, creating mock product');
      }
      
      // Create mock product as fallback
      const mockProduct = {
        id: Date.now(),
        ...productData,
        rating: 4.0 + (Math.random() * 0.9),
        reviews: Math.floor(Math.random() * 50) + 10,
        status: 'active',
        tags: ['New'],
        createdAt: new Date().toISOString().split('T')[0],
        image: productData.image || 'https://images.unsplash.com/photo-1594377155068-2f563a5d7c2a?w=400&h=300&fit=crop'
      };
      
      return mockProduct;
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      console.log('✏️ Updating product:', productId, productData);
      const response = await sellerAPI.updateProduct(productId, productData);
      console.log('✅ Product updated successfully:', response);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to update product:', error);
      // Check if it's a 404 error (endpoint doesn't exist yet)
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log('ℹ️  Seller update product endpoint not implemented yet');
      }
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      console.log('🗑️ Deleting product:', productId);
      await sellerAPI.deleteProduct(productId);
      console.log('✅ Product deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to delete product:', error);
      // Check if it's a 404 error (endpoint doesn't exist yet)
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log('ℹ️  Seller delete product endpoint not implemented yet');
        return true; // Simulate success for development
      }
      throw error;
    }
  },

  // Update product status
  updateProductStatus: async (productId, status) => {
    try {
      console.log('🔄 Updating product status:', productId, status);
      const response = await sellerAPI.updateProduct(productId, { status });
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to update product status:', error);
      throw error;
    }
  }
};

export const orderService = {
  // Get all orders
  fetchOrders: async (filters = {}) => {
    try {
      console.log('📋 Fetching orders from backend...', filters);
      const response = await sellerAPI.getOrders(filters);
      console.log('✅ Orders fetched successfully:', response);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to fetch orders, using mock data:', error);
      // Check if it's a 404 error (endpoint doesn't exist yet)
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log('ℹ️  Seller orders endpoint not implemented yet, using mock data');
      }
      return getMockOrders();
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      console.log('🔄 Updating order status:', orderId, status);
      const response = await sellerAPI.updateOrderStatus(orderId, status);
      console.log('✅ Order status updated successfully:', response);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to update order status:', error);
      throw error;
    }
  },

  // Process quick sale
  processQuickSale: async (saleData) => {
    try {
      console.log('💰 Processing quick sale:', saleData);
      const response = await sellerAPI.processQuickSale(saleData);
      console.log('✅ Quick sale processed successfully:', response);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to process quick sale:', error);
      // Check if it's a 404 error (endpoint doesn't exist yet)
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log('ℹ️  Seller quick sale endpoint not implemented yet, simulating success');
        return { success: true, message: 'Sale processed successfully (simulated)' };
      }
      throw error;
    }
  }
};

export const analyticsService = {
  // Get sales analytics
  fetchSalesAnalytics: async (timeRange = '7d') => {
    try {
      console.log('📊 Fetching sales analytics...', timeRange);
      const response = await sellerAPI.getSalesAnalytics(timeRange);
      console.log('✅ Analytics fetched successfully:', response);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to fetch analytics, using mock data:', error);
      // Check if it's a 404 error (endpoint doesn't exist yet)
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log('ℹ️  Seller analytics endpoint not implemented yet, using mock data');
      }
      // Return mock analytics data
      return [
        { day: 'Mon', sales: 45000, orders: 23 },
        { day: 'Tue', sales: 52000, orders: 28 },
        { day: 'Wed', sales: 38000, orders: 19 },
        { day: 'Thu', sales: 61000, orders: 32 },
        { day: 'Fri', sales: 49000, orders: 25 },
        { day: 'Sat', sales: 55000, orders: 29 },
        { day: 'Sun', sales: 42000, orders: 21 }
      ];
    }
  },

  // Get inventory stats
  fetchInventoryStats: async () => {
    try {
      console.log('📦 Fetching inventory stats...');
      const response = await sellerAPI.getInventoryStats();
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to fetch inventory stats:', error);
      // Return mock stats
      const mockProducts = getMockProducts();
      return {
        totalProducts: mockProducts.length,
        lowStockItems: mockProducts.filter(item => item.stock <= (item.lowStock || 5)).length,
        outOfStock: mockProducts.filter(item => item.stock === 0).length,
        categories: ['Seeds', 'Fertilizers', 'Equipment']
      };
    }
  }
};

export const deliveryService = {
  // Get deliveries
  fetchDeliveries: async (status = '') => {
    try {
      console.log('🚚 Fetching deliveries...', status);
      const response = await sellerAPI.getDeliveries(status);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to fetch deliveries, using mock data:', error);
      // Return mock delivery data
      return [
        {
          id: 'DEL-001',
          orderId: 'ORD-001',
          customer: 'John Kamau',
          address: '123 Farm Road, Kiambu',
          product: 'Maize Seeds Premium',
          status: 'in_transit',
          driver: 'James Mwangi',
          driverPhone: '+254712345678',
          estimatedDelivery: '2024-01-15T14:00:00',
          actualDelivery: null
        },
        {
          id: 'DEL-002',
          orderId: 'ORD-002',
          customer: 'Mary Wanjiku',
          address: '456 Green Valley, Nakuru',
          product: 'NPK Fertilizer 50kg',
          status: 'pending',
          driver: 'Not assigned',
          driverPhone: null,
          estimatedDelivery: '2024-01-16T10:00:00',
          actualDelivery: null
        }
      ];
    }
  },

  // Update delivery status
  updateDeliveryStatus: async (deliveryId, status) => {
    try {
      console.log('🔄 Updating delivery status:', deliveryId, status);
      const response = await sellerAPI.updateDeliveryStatus(deliveryId, status);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to update delivery status:', error);
      throw error;
    }
  },

  // Assign driver
  assignDriver: async (deliveryId, driverData) => {
    try {
      console.log('👨‍💼 Assigning driver:', deliveryId, driverData);
      const response = await sellerAPI.assignDriver(deliveryId, driverData);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to assign driver:', error);
      throw error;
    }
  }
};

// Dashboard service
export const dashboardService = {
  fetchDashboardData: async () => {
    try {
      console.log('📈 Fetching dashboard data...');
      const response = await sellerAPI.getDashboardData();
      console.log('✅ Dashboard data fetched successfully:', response);
      return response.data || response;
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data, using mock data:', error);
      
      // Check if it's a 404 error (endpoint doesn't exist yet)
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log('ℹ️  Seller dashboard endpoint not implemented yet, using comprehensive mock data');
      }
      
      // Return comprehensive mock dashboard data
      const mockProducts = getMockProducts();
      const mockOrders = getMockOrders();
      
      return {
        stats: {
          totalRevenue: mockOrders.reduce((sum, order) => sum + order.amount, 0),
          totalOrders: mockOrders.length,
          activeProducts: mockProducts.filter(p => p.status === 'active').length,
          lowStockItems: mockProducts.filter(item => item.stock <= (item.lowStock || 5)).length
        },
        recentOrders: mockOrders.slice(0, 5),
        topProducts: mockProducts.slice(0, 3),
        salesData: [
          { day: 'Mon', sales: 45000, orders: 23 },
          { day: 'Tue', sales: 52000, orders: 28 },
          { day: 'Wed', sales: 38000, orders: 19 },
          { day: 'Thu', sales: 61000, orders: 32 },
          { day: 'Fri', sales: 49000, orders: 25 },
          { day: 'Sat', sales: 55000, orders: 29 },
          { day: 'Sun', sales: 42000, orders: 21 }
        ]
      };
    }
  }
};

export default {
  products: productService,
  orders: orderService,
  analytics: analyticsService,
  delivery: deliveryService,
  dashboard: dashboardService
};