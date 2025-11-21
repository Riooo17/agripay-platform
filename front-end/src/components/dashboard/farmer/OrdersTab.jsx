import React, { useState, useEffect } from 'react';
import farmerApi from '../../../services/farmerApi';

const OrdersTab = ({ dashboardData, onDataUpdate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState('');
  const [bulkAction, setBulkAction] = useState('');
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  // Load orders
  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await farmerApi.getOrders(statusFilter);
      setOrders(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle order status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    setActionLoading(`status-${orderId}`);
    try {
      await farmerApi.updateOrderStatus(orderId, newStatus);
      alert(`Order ${newStatus} successfully!`);
      loadOrders();
      onDataUpdate(); // Refresh dashboard stats
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading('');
    }
  };

  // View order details
  const handleViewDetails = async (orderId) => {
    setActionLoading(`details-${orderId}`);
    try {
      const response = await farmerApi.getOrderDetails(orderId);
      setSelectedOrder(response.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading('');
    }
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedOrders.size === 0) {
      alert('Please select orders first');
      return;
    }

    setBulkAction(action);
    try {
      const orderIds = Array.from(selectedOrders);
      
      // Process each order
      for (const orderId of orderIds) {
        await farmerApi.updateOrderStatus(orderId, action);
      }
      
      alert(`Successfully ${action} ${orderIds.length} order(s)!`);
      setSelectedOrders(new Set());
      loadOrders();
      onDataUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setBulkAction('');
    }
  };

  // Toggle order selection
  const toggleOrderSelection = (orderId) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  // Select all filtered orders
  const toggleSelectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(order => order.id)));
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadOrders}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-blue-800">
              <strong>{selectedOrders.size}</strong> order(s) selected
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkAction('accepted')}
                disabled={bulkAction}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                {bulkAction === 'accepted' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <span>✓</span>
                )}
                <span>Accept Selected</span>
              </button>
              
              <button
                onClick={() => handleBulkAction('cancelled')}
                disabled={bulkAction}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                {bulkAction === 'cancelled' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <span>✕</span>
                )}
                <span>Cancel Selected</span>
              </button>
              
              <button
                onClick={() => setSelectedOrders(new Set())}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <div className="flex-1"></div>
          
          <button
            onClick={toggleSelectAll}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {selectedOrders.size === orders.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {/* Orders List */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-semibold mb-2">Error Loading Orders</div>
          <div className="text-red-500 text-sm mb-4">{error}</div>
          <button
            onClick={loadOrders}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {statusFilter !== 'all' 
              ? `No ${statusFilter} orders at the moment`
              : 'Orders from customers will appear here'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        from {order.customer?.name || 'Customer'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2 text-gray-900">{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <span className="ml-2 text-gray-900 font-semibold">₹{order.totalAmount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Items:</span>
                      <span className="ml-2 text-gray-900">
                        {order.items?.length || 0} item(s)
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-sm text-gray-600">
                        {order.items.slice(0, 2).map((item, index) => (
                          <span key={index}>
                            {item.product?.name} ({item.quantity} {item.product?.unit})
                            {index < Math.min(order.items.length - 1, 1) && ', '}
                          </span>
                        ))}
                        {order.items.length > 2 && ` and ${order.items.length - 2} more...`}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    disabled={actionLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    {actionLoading === `details-${order.id}` ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <span>👁️</span>
                    )}
                    <span>Details</span>
                  </button>

                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'accepted')}
                        disabled={actionLoading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                      >
                        {actionLoading === `status-${order.id}` ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <span>✓</span>
                        )}
                        <span>Accept</span>
                      </button>
                      
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        disabled={actionLoading}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                      >
                        {actionLoading === `status-${order.id}` ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <span>✕</span>
                        )}
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {order.status === 'accepted' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'in_transit')}
                      disabled={actionLoading}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                    >
                      {actionLoading === `status-${order.id}` ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <span>🚚</span>
                      )}
                      <span>Ship</span>
                    </button>
                  )}

                  {order.status === 'in_transit' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'completed')}
                      disabled={actionLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                    >
                      {actionLoading === `status-${order.id}` ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <span>✅</span>
                      )}
                      <span>Complete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Order Details - #{selectedOrder.id.slice(-8).toUpperCase()}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedOrder.customer?.name}</div>
                    <div><strong>Email:</strong> {selectedOrder.customer?.email}</div>
                    <div><strong>Phone:</strong> {selectedOrder.customer?.phone}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</div>
                    <div><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.product?.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.quantity} {item.product?.unit} × ₹{item.price}
                        </div>
                      </div>
                      <div className="font-semibold">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedOrder.id, 'accepted');
                        setSelectedOrder(null);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedOrder.id, 'cancelled');
                        setSelectedOrder(null);
                      }}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject Order
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
