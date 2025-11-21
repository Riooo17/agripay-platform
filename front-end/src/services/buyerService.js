// src/services/buyerService.js
import { buyerAPI } from './api';

export const buyerService = {
  // Get dashboard overview data
  async getDashboardData() {
    try {
      const token = localStorage.getItem('agripay_token');
      console.log('📊 Fetching real buyer dashboard data...');
      const result = await buyerAPI.getDashboardData(token);
      
      if (result.success) {
        console.log('✅ Real dashboard data:', result.data);
        return result.data;
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
      const token = localStorage.getItem('agripay_token');
      console.log('🔍 Fetching real products...');
      const result = await buyerAPI.getProducts(filters, token);
      
      if (result.success) {
        console.log('✅ Real products data:', result.data);
        return result.data;
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
  async getOrders() {
    try {
      const token = localStorage.getItem('agripay_token');
      console.log('📦 Fetching real orders...');
      const result = await buyerAPI.getOrders(token);
      
      if (result.success) {
        console.log('✅ Real orders data:', result.data);
        return result.data;
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
      const token = localStorage.getItem('agripay_token');
      console.log('🔔 Fetching real notifications...');
      const result = await buyerAPI.getNotifications(token);
      
      if (result.success) {
        console.log('✅ Real notifications:', result.data);
        return result.data;
      } else {
        console.error('❌ Notifications fetch failed:', result.message);
        return [];
      }
    } catch (error) {
      console.error('❌ Notifications API error:', error);
      return [];
    }
  }
};