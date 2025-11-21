// File: /src/components/seller/DeliveryManager.jsx
import React, { useState } from 'react';
import { MapPin, Truck, Clock, CheckCircle, XCircle, Phone, Navigation } from 'lucide-react';

const DeliveryManager = ({ orders }) => {
  const [deliveries, setDeliveries] = useState([
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
      actualDelivery: null,
      coordinates: { lat: -1.2921, lng: 36.8219 }
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
      actualDelivery: null,
      coordinates: { lat: -0.3031, lng: 36.0800 }
    },
    {
      id: 'DEL-003',
      orderId: 'ORD-003',
      customer: 'David Ochieng',
      address: '789 Lake View, Kisumu',
      product: 'Water Pump 2HP',
      status: 'delivered',
      driver: 'Peter Odhiambo',
      driverPhone: '+254723456789',
      estimatedDelivery: '2024-01-14T16:00:00',
      actualDelivery: '2024-01-14T15:45:00',
      coordinates: { lat: -0.1022, lng: 34.7617 }
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const handleUpdateStatus = (deliveryId, newStatus) => {
    setDeliveries(deliveries.map(delivery => 
      delivery.id === deliveryId 
        ? { 
            ...delivery, 
            status: newStatus,
            ...(newStatus === 'delivered' && !delivery.actualDelivery 
              ? { actualDelivery: new Date().toISOString() }
              : {}
            )
          }
        : delivery
    ));
  };

  const handleAssignDriver = (deliveryId) => {
    const driver = prompt('Enter driver name:');
    const phone = prompt('Enter driver phone number:');
    
    if (driver && phone) {
      setDeliveries(deliveries.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, driver, driverPhone: phone, status: 'in_transit' }
          : delivery
      ));
    }
  };

  const handleCallCustomer = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const handleTrackDelivery = (delivery) => {
    // In a real app, this would open a map with real-time tracking
    alert(`🚚 Tracking delivery ${delivery.id}\n\nCustomer: ${delivery.customer}\nAddress: ${delivery.address}\nStatus: ${delivery.status}\n\nReal-time tracking would be integrated with Google Maps API.`);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Delivery Management</h2>
        <p className="text-sm text-gray-600 mt-1">Manage and track all your deliveries</p>
      </div>

      <div className="overflow-hidden">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Delivery Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-3xl">🚚</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {delivery.id}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {getStatusIcon(delivery.status)}
                        <span className="ml-1 capitalize">
                          {delivery.status.replace('_', ' ')}
                        </span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {delivery.product} • {delivery.customer}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {delivery.address}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        ETA: {new Date(delivery.estimatedDelivery).toLocaleString()}
                      </div>
                      {delivery.driverPhone && (
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-1" />
                          {delivery.driver}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {delivery.status === 'pending' && (
                    <button
                      onClick={() => handleAssignDriver(delivery.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Assign Driver
                    </button>
                  )}
                  
                  {delivery.status === 'in_transit' && (
                    <button
                      onClick={() => handleUpdateStatus(delivery.id, 'delivered')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Mark Delivered
                    </button>
                  )}

                  {delivery.driverPhone && (
                    <button
                      onClick={() => handleCallCustomer(delivery.driverPhone)}
                      className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call Driver
                    </button>
                  )}

                  <button 
                    onClick={() => handleTrackDelivery(delivery)}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Track
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {delivery.status !== 'delivered' && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className={delivery.status !== 'pending' ? 'text-green-600 font-semibold' : ''}>
                      Order Placed
                    </span>
                    <span className={delivery.status === 'in_transit' ? 'text-green-600 font-semibold' : ''}>
                      In Transit
                    </span>
                    <span className={delivery.status === 'delivered' ? 'text-green-600 font-semibold' : ''}>
                      Delivered
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: delivery.status === 'pending' ? '33%' : 
                               delivery.status === 'in_transit' ? '66%' : '100%'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Delivery Time */}
              {delivery.actualDelivery && (
                <div className="mt-2 text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Delivered on {new Date(delivery.actualDelivery).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {deliveries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries scheduled</h3>
          <p className="text-gray-500 mb-4">
            When you receive orders, they will appear here for delivery management.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryManager;