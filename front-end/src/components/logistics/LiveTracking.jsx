// src/components/logistics/LiveTracking.jsx
import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Users,
  Truck,
  Zap,
  AlertTriangle,
  Filter,
  RefreshCw,
  Download
} from 'lucide-react';

const LiveTracking = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock live tracking data
    setVehicles([
      {
        id: 1,
        name: 'Toyota Hilux KCD 123A',
        driver: 'John Kamau',
        status: 'in_transit',
        location: 'Thika Road, Nairobi',
        destination: 'City Market',
        speed: 65,
        eta: '25 mins',
        lastUpdate: '2 min ago',
        coordinates: { lat: -1.2921, lng: 36.8219 },
        cargo: 'Fresh Vegetables',
        temperature: '24°C'
      },
      {
        id: 2,
        name: 'Isuzu NPR KAB 456B',
        driver: 'Sarah Mwende',
        status: 'loading',
        location: 'Kiambu Farms',
        destination: 'Westgate Mall',
        speed: 0,
        eta: '45 mins',
        lastUpdate: '5 min ago',
        coordinates: { lat: -1.1710, lng: 36.8350 },
        cargo: 'Dairy Products',
        temperature: '4°C'
      },
      {
        id: 3,
        name: 'Mitsubishi Fuso KCE 789C',
        driver: 'Mike Ochieng',
        status: 'in_transit',
        location: 'Mombasa Road',
        destination: 'Nakuru',
        speed: 80,
        eta: '3 hours',
        lastUpdate: '1 min ago',
        coordinates: { lat: -1.3030, lng: 36.8550 },
        cargo: 'Grains',
        temperature: '28°C'
      },
      {
        id: 4,
        name: 'Nissan Urvan KCF 012D',
        driver: 'Grace Wanjiku',
        status: 'maintenance',
        location: 'Depot',
        destination: 'N/A',
        speed: 0,
        eta: 'N/A',
        lastUpdate: '1 hour ago',
        coordinates: { lat: -1.3000, lng: 36.8000 },
        cargo: 'None',
        temperature: 'N/A'
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_transit': return 'bg-green-100 text-green-800';
      case 'loading': return 'bg-blue-100 text-blue-800';
      case 'unloading': return 'bg-orange-100 text-orange-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_transit': return Truck;
      case 'loading': return MapPin;
      case 'unloading': return MapPin;
      case 'maintenance': return AlertTriangle;
      case 'idle': return Clock;
      default: return Truck;
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filter === 'all') return true;
    return vehicle.status === filter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
          <p className="text-gray-600 mt-1">Real-time vehicle tracking and route monitoring</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Vehicles</option>
            <option value="in_transit">In Transit</option>
            <option value="loading">Loading</option>
            <option value="unloading">Unloading</option>
            <option value="idle">Idle</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Active Vehicles</h2>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                {filteredVehicles.length} online
              </span>
            </div>
            <div className="space-y-3">
              {filteredVehicles.map((vehicle) => {
                const StatusIcon = getStatusIcon(vehicle.status);
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedVehicle?.id === vehicle.id
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Driver:</span>
                        <span className="font-medium">{vehicle.driver}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium truncate ml-2">{vehicle.location}</span>
                      </div>
                      {vehicle.speed > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Speed:</span>
                          <span className="font-medium text-green-600">{vehicle.speed} km/h</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETA:</span>
                        <span className="font-medium text-blue-600">{vehicle.eta}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Updated {vehicle.lastUpdate}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Zap className="h-3 w-3 text-green-500" />
                        <span>Live</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedVehicle ? `${selectedVehicle.name} - Live Tracking` : 'Fleet Overview Map'}
              </h2>
              <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Export Route</span>
              </button>
            </div>

            {/* Map Placeholder - Replace with AgriPayAfricaMap */}
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Tracking Map</h3>
                <p className="text-gray-600 mb-4">
                  {selectedVehicle 
                    ? `Tracking ${selectedVehicle.name} from ${selectedVehicle.location} to ${selectedVehicle.destination}`
                    : 'Real-time vehicle positions and route optimization'
                  }
                </p>
                <div className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-green-700">
                  Activate AgriPayAfricaMap
                </div>
              </div>
            </div>

            {/* Selected Vehicle Details */}
            {selectedVehicle && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-700">Driver Info</span>
                  </div>
                  <p className="text-sm text-gray-900">{selectedVehicle.driver}</p>
                  <p className="text-xs text-gray-600">Active • 8h 23m today</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-gray-700">Cargo</span>
                  </div>
                  <p className="text-sm text-gray-900">{selectedVehicle.cargo}</p>
                  <p className="text-xs text-gray-600">Temp: {selectedVehicle.temperature}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-gray-700">Trip Info</span>
                  </div>
                  <p className="text-sm text-gray-900">ETA: {selectedVehicle.eta}</p>
                  <p className="text-xs text-gray-600">Speed: {selectedVehicle.speed} km/h</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;