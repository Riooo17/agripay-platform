// src/services/buyerService.js
import { buyerAPI } from './api';

export const buyerService = {
  // Get dashboard overview data
  async getDashboardData() {
    try {
      console.log('📊 Fetching real buyer dashboard data...');
      const result = await buyerAPI.getDashboardData();
      
      if (result.success) {
        console.log('✅ Real dashboard data received');
        return result.data || result;
      } else {
        console.error('❌ Dashboard data fetch failed:', result.message);
        return null;
      }
    } catch (error) {
      console.error('❌ Dashboard API error:', error);
      return null;
    }
  },

  // Get products for discovery
  async getProducts(filters = {}) {
    try {
      console.log('🔍 Fetching real products...');
      const result = await buyerAPI.getProducts(filters);
      
      if (result.success) {
        console.log('✅ Real products data received');
        return result.data || result;
      } else {
        console.error('❌ Products fetch failed:', result.message);
        return [];
      }
    } catch (error) {
      console.error('❌ Products API error:', error);
      return [];
    }
  },

  // Get buyer orders
  async getOrders(status = '') {
    try {
      console.log('📦 Fetching real orders...');
      const result = await buyerAPI.getOrders(status);
      
      if (result.success) {
        console.log('✅ Real orders data received');
        return result.data || result;
      } else {
        console.error('❌ Orders fetch failed:', result.message);
        return [];
      }
    } catch (error) {
      console.error('❌ Orders API error:', error);
      return [];
    }
  },

  // Get notifications
  async getNotifications() {
    try {
      console.log('🔔 Fetching real notifications...');
      const result = await buyerAPI.getNotifications();
      
      if (result.success) {
        console.log('✅ Real notifications received');
        return result.data || result;
      } else {
        console.error('❌ Notifications fetch failed:', result.message);
        return [];
      }
    } catch (error) {
      console.error('❌ Notifications API error:', error);
      return [];
    }
  },

  // Place new order
  async placeOrder(orderData) {
    try {
      console.log('🛒 Placing real order...');
      const result = await buyerAPI.placeOrder(orderData);
      
      if (result.success) {
        console.log('✅ Order placed successfully');
        return result.data || result;
      } else {
        console.error('❌ Order placement failed:', result.message);
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('❌ Order API error:', error);
      throw error;
    }
  },

  // Record payment (for Paystack success)
  async recordPayment(paymentData) {
    try {
      console.log('💰 Recording payment...', paymentData);
      // This would call your backend to record the payment
      // For now, simulate success since Paystack already processed it
      return { success: true, message: 'Payment recorded successfully' };
    } catch (error) {
      console.error('❌ Payment recording error:', error);
      throw error;
    }
  }
};