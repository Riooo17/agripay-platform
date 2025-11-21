// src/components/logistics/FleetManagement.jsx
import React, { useState } from 'react';
import { 
  Truck, 
  Users, 
  MapPin, 
  Zap, 
  AlertTriangle, 
  CheckCircle2,
  MoreVertical,
  Plus,
  Filter,
  Search
} from 'lucide-react';

const FleetManagement = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: 'Toyota Hilux KCD 123A',
      type: 'Pickup Truck',
      status: 'active',
      driver: 'John Kamau',
      location: 'Nairobi CBD',
      capacity: '2 Tons',
      fuel: 85,
      maintenance: 'Good',
      lastService: '2024-01-15',
      nextService: '2024-02-15',
      online: true
    },
    {
      id: 2,
      name: 'Isuzu NPR KAB 456B',
      type: 'Medium Truck',
      status: 'on_delivery',
      driver: 'Sarah Mwende',
      location: 'Thika Road',
      capacity: '5 Tons',
      fuel: 45,
      maintenance: 'Due Soon',
      lastService: '2024-01-10',
      nextService: '2024-02-10',
      online: true
    },
    {
      id: 3,
      name: 'Mitsubishi Fuso KCE 789C',
      type: 'Heavy Truck',
      status: 'maintenance',
      driver: 'Mike Ochieng',
      location: 'Depot',
      capacity: '10 Tons',
      fuel: 90,
      maintenance: 'In Service',
      lastService: '2024-01-20',
      nextService: '2024-02-20',
      online: false
    }
  ]);

  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: 'John Kamau',
      phone: '+254 712 345 678',
      status: 'active',
      rating: 4.8,
      deliveries: 147,
      vehicle: 'Toyota Hilux KCD 123A',
      online: true
    },
    {
      id: 2,
      name: 'Sarah Mwende',
      phone: '+254 723 456 789',
      status: 'on_delivery',
      rating: 4.9,
      deliveries: 203,
      vehicle: 'Isuzu NPR KAB 456B',
      online: true
    },
    {
      id: 3,
      name: 'Mike Ochieng',
      phone: '+254 734 567 890',
      status: 'offline',
      rating: 4.6,
      deliveries: 89,
      vehicle: 'Mitsubishi Fuso KCE 789C',
      online: false
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on_delivery': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Available';
      case 'on_delivery': return 'On Delivery';
      case 'maintenance': return 'Maintenance';
      case 'offline': return 'Offline';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600 mt-1">Manage your vehicles, drivers, and maintenance schedules</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Vehicle</span>
          </button>
          <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Truck className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Now</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Zap className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maintenance Due</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Drivers</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicles List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Vehicles</h2>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    vehicle.online ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600">{vehicle.type} • {vehicle.capacity}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                        {getStatusText(vehicle.status)}
                      </span>
                      <span className="text-xs text-gray-500">{vehicle.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{vehicle.driver}</p>
                    <p className="text-xs text-gray-500">Fuel: {vehicle.fuel}%</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drivers List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Drivers</h2>
          </div>
          <div className="p-6 space-y-4">
            {drivers.map((driver) => (
              <div key={driver.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                    <p className="text-sm text-gray-600">{driver.phone}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">{driver.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">{driver.deliveries} deliveries</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    driver.online ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-600">{driver.online ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Maintenance Schedule</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {vehicles.filter(v => v.maintenance !== 'Good').map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                    <p className="text-sm text-orange-600">{vehicle.maintenance}</p>
                    <p className="text-xs text-gray-500">Next service: {vehicle.nextService}</p>
                  </div>
                </div>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm">
                  Schedule Service
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Star icon component
const Star = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default FleetManagement;