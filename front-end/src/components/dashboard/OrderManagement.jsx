// src/components/dashboard/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { buyerService } from '../../services/buyerService';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load real orders from backend
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      console.log('🔄 Loading real orders from backend...');
      
      try {
        const ordersData = await buyerService.getOrders();
        if (ordersData && ordersData.length > 0) {
          setOrders(ordersData);
          console.log('✅ Real orders loaded successfully:', ordersData.length, 'orders');
        } else {
          console.log('ℹ️ No orders found or empty response');
          setOrders([]);
        }
      } catch (error) {
        console.error('❌ Failed to load orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped':
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped':
      case 'in_transit': return 'In Transit';
      case 'processing': return 'Processing';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDeliveryEstimate = (orderDate, status) => {
    if (status === 'delivered') return 'Delivered';
    
    const orderDateObj = new Date(orderDate);
    const estimate = new Date(orderDateObj);
    estimate.setDate(estimate.getDate() + 3); // Default 3 days estimate
    
    return estimate.toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <h1 className="text-2xl font-bold text-green-800 mb-2">📦 Order Management</h1>
          <p className="text-green-600">Loading your orders...</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-green-800 font-semibold">Loading your order history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
        <h1 className="text-2xl font-bold text-green-800 mb-2">📦 Order Management</h1>
        <p className="text-green-600">Track and manage your agricultural orders</p>
        
        {/* Order Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-green-800">{orders.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm">In Transit</p>
            <p className="text-2xl font-bold text-blue-800">
              {orders.filter(o => o.status === 'in_transit' || o.status === 'shipped').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-600 text-sm">Processing</p>
            <p className="text-2xl font-bold text-yellow-800">
              {orders.filter(o => o.status === 'processing').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm">Delivered</p>
            <p className="text-2xl font-bold text-green-800">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-green-200">
          <h2 className="text-lg font-semibold text-green-800">Recent Orders ({orders.length})</h2>
        </div>
        
        {orders.length > 0 ? (
          <div className="divide-y divide-green-100">
            {orders.map((order) => (
              <div key={order._id || order.id} className="p-6 hover:bg-green-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-green-900 text-lg">
                              {order.productName || order.product?.name || 'Agricultural Product'}
                            </h3>
                            <p className="text-green-600 text-sm mt-1">
                              {order.supplier?.name || order.supplier || 'Supplier'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-800">
                              KSh {(order.amount || order.totalAmount || 0).toLocaleString()}
                            </p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-3 text-sm text-green-600">
                          <span>Quantity: {order.quantity || order.quantity} {order.unit || 'kg'}</span>
                          <span>Order Date: {formatDate(order.orderDate || order.createdAt)}</span>
                          {order.trackingNumber && (
                            <span>Tracking: {order.trackingNumber}</span>
                          )}
                        </div>
                        
                        {order.deliveryAddress && (
                          <p className="text-green-600 text-sm mt-2">
                            Delivery: {order.deliveryAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Actions */}
                {(order.status === 'in_transit' || order.status === 'shipped') && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">
                        Estimated delivery: {getDeliveryEstimate(order.orderDate || order.createdAt, order.status)}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Track Package
                        </button>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {order.status === 'processing' && (
                  <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-yellow-700">
                        Your order is being processed by the supplier
                      </span>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )}
                
                {order.status === 'delivered' && (
                  <div className="mt-4 bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700">
                        ✅ Order delivered successfully
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-green-600 hover:text-green-800 font-medium">
                          Download Invoice
                        </button>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">No orders yet</h3>
            <p className="text-green-600">Start shopping to see your orders here</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setSelectedOrder(null)} />
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-green-900">
                          Order Details
                        </h3>
                        <p className="text-green-600 mt-1">
                          {selectedOrder._id || selectedOrder.id}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-green-600 text-sm">Product</p>
                          <p className="font-semibold text-green-900">
                            {selectedOrder.productName || selectedOrder.product?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-600 text-sm">Supplier</p>
                          <p className="font-semibold text-green-900">
                            {selectedOrder.supplier?.name || selectedOrder.supplier}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-600 text-sm">Quantity</p>
                          <p className="font-semibold text-green-900">
                            {selectedOrder.quantity} {selectedOrder.unit || 'kg'}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-600 text-sm">Total Amount</p>
                          <p className="font-semibold text-green-900">
                            KSh {(selectedOrder.amount || selectedOrder.totalAmount || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-600 text-sm">Order Date</p>
                          <p className="font-semibold text-green-900">
                            {formatDate(selectedOrder.orderDate || selectedOrder.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-600 text-sm">Status</p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusText(selectedOrder.status)}
                          </span>
                        </div>
                      </div>
                      
                      {selectedOrder.deliveryAddress && (
                        <div>
                          <p className="text-green-600 text-sm">Delivery Address</p>
                          <p className="font-semibold text-green-900">{selectedOrder.deliveryAddress}</p>
                        </div>
                      )}
                      
                      {selectedOrder.trackingNumber && (
                        <div>
                          <p className="text-green-600 text-sm">Tracking Number</p>
                          <p className="font-semibold text-green-900">{selectedOrder.trackingNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;