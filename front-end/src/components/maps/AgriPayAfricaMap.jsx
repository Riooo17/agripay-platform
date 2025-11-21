// src/components/maps/AgriPayAfricaMap.jsx - COMPLETE UPDATED VERSION
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Enhanced custom icons
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        color: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 16px;
      ">
        ${emoji}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const icons = {
  farmer: createCustomIcon('#22c55e', '🌱'),
  buyer: createCustomIcon('#3b82f6', '🏪'),
  supplier: createCustomIcon('#8b5cf6', '🏭'),
  logistics: createCustomIcon('#f97316', '🚚'),
  delivery: createCustomIcon('#ef4444', '📦'),
};

// Map controller component
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const AgriPayAfricaMap = ({ 
  farmerProfile = {},
  crops = [],
  currentRole = 'farmer',
  height = '600px',
  defaultRegion = 'all',
  onConnect = null,
  onMessage = null,
  onMarkerClick = null
}) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState(defaultRegion);
  const [mapCenter, setMapCenter] = useState([6.465422, 20.813742]);
  const [mapZoom, setMapZoom] = useState(4);
  const [activeMarker, setActiveMarker] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Major African cities coordinates by region
  const africanRegions = {
    east: {
      name: 'East Africa',
      center: [1.2921, 36.8219],
      countries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Ethiopia', 'Somalia'],
      cities: {
        nairobi: [-1.2921, 36.8219],
        darEsSalaam: [-6.7924, 39.2083],
        kampala: [0.3476, 32.5825],
        kigali: [-1.9706, 30.1044],
        addisAbaba: [8.9806, 38.7578],
        mogadishu: [2.0371, 45.3438],
        juba: [4.8594, 31.5713],
      }
    },
    west: {
      name: 'West Africa',
      center: [9.0820, 8.6753],
      countries: ['Nigeria', 'Ghana', 'Ivory Coast', 'Senegal', 'Mali', 'Burkina Faso'],
      cities: {
        lagos: [6.5244, 3.3792],
        accra: [5.6037, -0.1870],
        abidjan: [5.3600, -4.0083],
        dakar: [14.7167, -17.4677],
        bamako: [12.6392, -8.0029],
        ouagadougou: [12.3714, -1.5197],
      }
    },
    south: {
      name: 'Southern Africa',
      center: [-22.3285, 24.6849],
      countries: ['South Africa', 'Zimbabwe', 'Zambia', 'Mozambique', 'Angola', 'Malawi'],
      cities: {
        johannesburg: [-26.2041, 28.0473],
        harare: [-17.8292, 31.0522],
        lusaka: [-15.3875, 28.3228],
        maputo: [-25.9653, 32.5892],
        luanda: [-8.8383, 13.2344],
        lilongwe: [-13.9626, 33.7741],
      }
    },
    north: {
      name: 'North Africa',
      center: [31.7917, 7.0926],
      countries: ['Egypt', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Sudan'],
      cities: {
        cairo: [30.0444, 31.2357],
        casablanca: [33.5731, -7.5898],
        algiers: [36.7538, 3.0588],
        tunis: [36.8065, 10.1815],
        tripoli: [32.8872, 13.1913],
        khartoum: [15.5007, 32.5599],
      }
    },
    central: {
      name: 'Central Africa',
      center: [4.0383, 21.7587],
      countries: ['DRC', 'Congo', 'Cameroon', 'Gabon', 'Chad', 'Central African Republic'],
      cities: {
        kinshasa: [-4.4419, 15.2663],
        douala: [4.0511, 9.7679],
        libreville: [0.4162, 9.4673],
        ndjamena: [12.1348, 15.0557],
        brazzaville: [-4.2634, 15.2429],
        bangui: [4.3947, 18.5582],
      }
    }
  };

  // Generate realistic Africa-wide agricultural data
  const generateAfricaEcosystemData = () => {
    const currentFarmer = {
      id: 'current-farmer',
      name: farmerProfile.name || 'Your Farm',
      farmName: farmerProfile.farmName || 'My Farm',
      type: 'farmer',
      position: farmerProfile.location || africanRegions.east.cities.nairobi,
      products: crops.map(crop => crop?.name).filter(Boolean) || ['Mixed Crops'],
      contact: farmerProfile.phone || '+254700000000',
      trustScore: farmerProfile.trustScore || 85,
      region: 'east',
      isCurrentUser: true
    };

    const africanFarmers = [
      {
        id: 'farmer-kenya',
        name: 'John Kamau Farm',
        farmName: 'Nakuru Green Fields',
        type: 'farmer',
        position: [-0.3031, 36.0800],
        products: ['Maize', 'Wheat', 'Vegetables'],
        contact: '+254712345678',
        trustScore: 88,
        farmSize: '50 acres',
        region: 'east'
      },
      {
        id: 'farmer-tanzania',
        name: 'Mama Asha Farm',
        farmName: 'Arusha Coffee Co.',
        type: 'farmer',
        position: [-3.3869, 36.6830],
        products: ['Coffee', 'Sisal', 'Maize'],
        contact: '+255712345678',
        trustScore: 85,
        farmSize: '30 acres',
        region: 'east'
      },
      {
        id: 'farmer-nigeria',
        name: 'Ibrahim Farms',
        farmName: 'Kano Grain Producers',
        type: 'farmer',
        position: [12.0022, 8.5920],
        products: ['Sorghum', 'Millet', 'Groundnuts'],
        contact: '+2348012345678',
        trustScore: 82,
        farmSize: '75 acres',
        region: 'west'
      },
      {
        id: 'farmer-ghana',
        name: 'Kwame Cocoa Farm',
        farmName: 'Kumasi Cocoa Estate',
        type: 'farmer',
        position: [6.7000, -1.6167],
        products: ['Cocoa', 'Plantain', 'Yam'],
        contact: '+233201234567',
        trustScore: 90,
        farmSize: '40 acres',
        region: 'west'
      },
      {
        id: 'farmer-south-africa',
        name: 'Van der Merwe Farms',
        farmName: 'Western Cape Vineyards',
        type: 'farmer',
        position: [-33.9249, 18.4241],
        products: ['Grapes', 'Wine', 'Citrus'],
        contact: '+27101234567',
        trustScore: 92,
        farmSize: '200 acres',
        region: 'south'
      }
    ];

    const africanBuyers = [
      {
        id: 'nairobi-market',
        name: 'Nairobi Fresh Market',
        type: 'buyer',
        position: africanRegions.east.cities.nairobi,
        requirements: ['Vegetables', 'Fruits', 'Cereals'],
        contact: '+254756789012',
        rating: 4.8,
        capacity: 'Large',
        region: 'east'
      },
      {
        id: 'lagos-market',
        name: 'Lagos Wholesale Market',
        type: 'buyer',
        position: africanRegions.west.cities.lagos,
        requirements: ['Grains', 'Tubers', 'Vegetables'],
        contact: '+2349012345678',
        rating: 4.6,
        capacity: 'Very Large',
        region: 'west'
      },
      {
        id: 'johannesburg-market',
        name: 'Joburg Fresh Produce',
        type: 'buyer',
        position: africanRegions.south.cities.johannesburg,
        requirements: ['Fruits', 'Wine', 'Meat'],
        contact: '+27111234567',
        rating: 4.7,
        capacity: 'Export',
        region: 'south'
      }
    ];

    const africanSuppliers = [
      {
        id: 'supplier-nairobi',
        name: 'East Africa Seed Co.',
        type: 'supplier',
        position: [-1.2921, 36.8219],
        products: ['Seeds', 'Fertilizers', 'Tools'],
        contact: '+254789012345',
        rating: 4.7,
        region: 'east'
      },
      {
        id: 'supplier-lagos',
        name: 'West Africa Ag Inputs',
        type: 'supplier',
        position: [6.5244, 3.3792],
        products: ['Equipment', 'Chemicals', 'Irrigation'],
        contact: '+234812345678',
        rating: 4.4,
        region: 'west'
      }
    ];

    const africanLogistics = [
      {
        id: 'logistics-nairobi',
        name: 'Pan-African Logistics',
        type: 'logistics',
        position: [-1.2921, 36.8219],
        services: ['Cross-border Transport', 'Cold Chain', 'Export'],
        contact: '+254701234567',
        rating: 4.6,
        region: 'east'
      },
      {
        id: 'logistics-lagos',
        name: 'West Africa Cargo',
        type: 'logistics',
        position: [6.5244, 3.3792],
        services: ['Port Logistics', 'Bulk Haulage'],
        contact: '+234701234567',
        rating: 4.5,
        region: 'west'
      }
    ];

    const africanDeliveries = [
      {
        id: 'delivery-1',
        name: 'Coffee to Mombasa Port',
        type: 'delivery',
        position: [-2.5000, 37.5000],
        from: 'Arusha Coffee Co.',
        to: 'Mombasa Export Port',
        product: 'Premium Coffee',
        quantity: '5 tons',
        eta: '2 days',
        progress: 0.4,
        region: 'east'
      },
      {
        id: 'delivery-2',
        name: 'Cocoa to Lagos Port',
        type: 'delivery',
        position: [7.0000, 3.5000],
        from: 'Kumasi Cocoa Estate',
        to: 'Lagos Export Terminal',
        product: 'Fairtrade Cocoa',
        quantity: '8 tons',
        eta: '3 days',
        progress: 0.7,
        region: 'west'
      }
    ];

    return {
      currentFarmer,
      farmers: [currentFarmer, ...africanFarmers],
      buyers: africanBuyers,
      suppliers: africanSuppliers,
      logistics: africanLogistics,
      deliveries: africanDeliveries
    };
  };

  const africaData = generateAfricaEcosystemData();

  // Filter data based on selection
  const getFilteredData = () => {
    let data = [];
    
    switch (selectedFilter) {
      case 'farmers':
        data = africaData.farmers;
        break;
      case 'buyers':
        data = africaData.buyers;
        break;
      case 'suppliers':
        data = africaData.suppliers;
        break;
      case 'logistics':
        data = [...africaData.logistics, ...africaData.deliveries];
        break;
      case 'my-network':
        data = [...africaData.farmers, ...africaData.buyers].filter(item => 
          item.trustScore > 80
        );
        break;
      default:
        data = [
          ...africaData.farmers,
          ...africaData.buyers,
          ...africaData.suppliers,
          ...africaData.logistics,
          ...africaData.deliveries
        ];
    }

    if (selectedRegion !== 'all') {
      data = data.filter(item => item.region === selectedRegion);
    }

    return data;
  };

  const filteredData = getFilteredData();

  // Handle region change
  const handleRegionChange = (region) => {
    setIsLoading(true);
    setSelectedRegion(region);
    
    if (region !== 'all') {
      setMapCenter(africanRegions[region].center);
      setMapZoom(6);
    } else {
      setMapCenter([6.465422, 20.813742]);
      setMapZoom(4);
    }
    
    setTimeout(() => setIsLoading(false), 500);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setIsLoading(true);
    setSelectedFilter(filter);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Handle connect button click
  const handleConnect = async (marker) => {
    console.log(`Connecting with ${marker.name} (${marker.type})`);
    
    setConnectionStatus(prev => ({
      ...prev,
      [marker.id]: 'pending'
    }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setConnectionStatus(prev => ({
      ...prev,
      [marker.id]: 'connected'
    }));

    // Show success notification
    alert(`✅ Connection request sent to ${marker.name}! You can now message them directly.`);

    if (onConnect) {
      onConnect(marker);
    }
  };

  // Handle message button click
  const handleMessage = (marker) => {
    console.log(`Messaging ${marker.name}`);
    
    const message = prompt(
      `Send a message to ${marker.name}:\n\nContact: ${marker.contact}`,
      `Hello! I'm interested in your ${marker.products ? marker.products.join(', ') : 'services'}. Can we discuss potential collaboration?`
    );
    
    if (message) {
      alert(`📨 Message sent to ${marker.name}!\n\nThey will contact you at your registered number.`);
    }

    if (onMessage) {
      onMessage(marker, message);
    }
  };

  // Handle marker click
  const handleMarkerClick = (marker) => {
    setActiveMarker(marker);
    console.log('Marker clicked:', marker);
    
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  // Get connection status
  const getConnectionStatus = (markerId) => {
    const status = connectionStatus[markerId];
    if (!status) return { text: 'Connect', style: 'bg-green-600 hover:bg-green-700' };
    if (status === 'pending') return { text: '⏳ Pending...', style: 'bg-yellow-500 cursor-not-allowed' };
    if (status === 'connected') return { text: '✅ Connected', style: 'bg-blue-600 cursor-not-allowed' };
    return { text: 'Connect', style: 'bg-green-600 hover:bg-green-700' };
  };

  // Handle view details
  const handleViewDetails = (marker) => {
    const details = `
🏷️ Name: ${marker.name}
${marker.farmName ? `🏠 Farm: ${marker.farmName}` : ''}
📍 Type: ${marker.type.toUpperCase()}
${marker.products ? `🌱 Products: ${marker.products.join(', ')}` : ''}
${marker.requirements ? `🛒 Requirements: ${marker.requirements.join(', ')}` : ''}
${marker.services ? `🚚 Services: ${marker.services.join(', ')}` : ''}
${marker.trustScore ? `⭐ Trust Score: ${marker.trustScore}%` : ''}
${marker.rating ? `🌟 Rating: ${'⭐'.repeat(Math.floor(marker.rating))} (${marker.rating})` : ''}
${marker.contact ? `📞 Contact: ${marker.contact}` : ''}
${marker.farmSize ? `📏 Farm Size: ${marker.farmSize}` : ''}
${marker.capacity ? `📦 Capacity: ${marker.capacity}` : ''}
    `.trim();

    alert(`📋 ${marker.name} Details:\n\n${details}`);
  };

  return (
    <div className="agripay-africa-map bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Map Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🗺️</span>
              AgriPay Africa Map
            </h2>
            <p className="text-green-100 text-sm">
              Pan-African Agricultural Ecosystem
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE GPS</span>
            </div>
            <div className="text-sm bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
              🌍 {filteredData.length} Active Players
            </div>
          </div>
        </div>
      </div>

      {/* Region Selector */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2 mb-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <span className="mr-2">🌍</span>
            Filter by Region:
          </label>
          {['all', 'east', 'west', 'south', 'north', 'central'].map(region => (
            <button
              key={region}
              onClick={() => handleRegionChange(region)}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedRegion === region
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              {region === 'all' ? '🌍 All Africa' :
               region === 'east' ? '🦁 East Africa' :
               region === 'west' ? '🌴 West Africa' :
               region === 'south' ? '🦓 Southern Africa' :
               region === 'north' ? '🐪 North Africa' :
               '🌳 Central Africa'}
            </button>
          ))}
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'farmers', 'buyers', 'suppliers', 'logistics', 'my-network'].map(filter => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedFilter === filter
                  ? filter === 'all' ? 'bg-gray-800 text-white shadow-md' :
                    filter === 'farmers' ? 'bg-green-600 text-white shadow-md' :
                    filter === 'buyers' ? 'bg-blue-600 text-white shadow-md' :
                    filter === 'suppliers' ? 'bg-purple-600 text-white shadow-md' :
                    filter === 'logistics' ? 'bg-orange-600 text-white shadow-md' :
                    'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              {filter === 'all' ? '👥 All Players' :
               filter === 'farmers' ? '🌱 Farmers' :
               filter === 'buyers' ? '🏪 Buyers' :
               filter === 'suppliers' ? '🏭 Suppliers' :
               filter === 'logistics' ? '🚚 Logistics' :
               '🤝 My Network'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <span className="text-sm text-yellow-700">Loading map data...</span>
          </div>
        </div>
      )}

      {/* Africa Map */}
      <div className="p-4">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height, width: '100%' }}
          className="rounded-lg shadow-md"
          scrollWheelZoom={true}
          minZoom={3}
          maxBounds={[
            [-35, -25],
            [40, 60]
          ]}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredData.map((item) => (
            <Marker
              key={item.id}
              position={item.position}
              icon={icons[item.type]}
              eventHandlers={{
                click: () => handleMarkerClick(item)
              }}
            >
              <Popup>
                <div className="p-3 min-w-64">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      item.type === 'farmer' ? 'bg-green-500' :
                      item.type === 'buyer' ? 'bg-blue-500' :
                      item.type === 'supplier' ? 'bg-purple-500' :
                      item.type === 'logistics' ? 'bg-orange-500' : 'bg-red-500'
                    }`}>
                      {item.type === 'farmer' ? '🌱' :
                       item.type === 'buyer' ? '🏪' :
                       item.type === 'supplier' ? '🏭' :
                       item.type === 'logistics' ? '🚚' : '📦'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {item.region === 'east' ? '🦁' :
                           item.region === 'west' ? '🌴' :
                           item.region === 'south' ? '🦓' :
                           item.region === 'north' ? '🐪' : '🌳'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                      {item.farmName && (
                        <p className="text-xs text-gray-500">{item.farmName}</p>
                      )}
                      {item.isCurrentUser && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                          👋 This is you
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {item.products && (
                      <div>
                        <strong>Products:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.products.map((product, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.requirements && (
                      <div>
                        <strong>Requirements:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.requirements.map((req, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.services && (
                      <div>
                        <strong>Services:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.services.map((service, idx) => (
                            <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.trustScore && (
                      <div className="flex items-center gap-2">
                        <strong>Trust Score:</strong>
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.trustScore >= 80 ? 'bg-green-500' :
                                item.trustScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${item.trustScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{item.trustScore}%</span>
                        </div>
                      </div>
                    )}

                    {item.rating && (
                      <div className="flex items-center gap-2">
                        <strong>Rating:</strong>
                        <span className="text-yellow-500">{"⭐".repeat(Math.floor(item.rating))}</span>
                        <span className="text-xs text-gray-600">({item.rating})</span>
                      </div>
                    )}

                    {item.contact && (
                      <div>
                        <strong>Contact:</strong>
                        <p className="text-blue-600 text-xs">{item.contact}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    {!item.isCurrentUser && (
                      <>
                        <button 
                          onClick={() => handleConnect(item)}
                          disabled={connectionStatus[item.id] === 'pending' || connectionStatus[item.id] === 'connected'}
                          className={`flex-1 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none ${
                            getConnectionStatus(item.id).style
                          }`}
                        >
                          {getConnectionStatus(item.id).text}
                        </button>
                        <button 
                          onClick={() => handleMessage(item)}
                          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
                        >
                          Message
                        </button>
                        <button 
                          onClick={() => handleViewDetails(item)}
                          className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                        >
                          Details
                        </button>
                      </>
                    )}
                    {item.isCurrentUser && (
                      <button 
                        disabled
                        className="flex-1 bg-gray-400 text-white py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
                      >
                        Your Location
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              {africaData.farmers.filter(f => selectedRegion === 'all' || f.region === selectedRegion).length}
            </div>
            <div className="text-xs text-gray-600">Farmers</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {africaData.buyers.filter(f => selectedRegion === 'all' || f.region === selectedRegion).length}
            </div>
            <div className="text-xs text-gray-600">Buyers</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {africaData.suppliers.filter(f => selectedRegion === 'all' || f.region === selectedRegion).length}
            </div>
            <div className="text-xs text-gray-600">Suppliers</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              {africaData.logistics.filter(f => selectedRegion === 'all' || f.region === selectedRegion).length}
            </div>
            <div className="text-xs text-gray-600">Logistics</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">
              {africaData.deliveries.filter(f => selectedRegion === 'all' || f.region === selectedRegion).length}
            </div>
            <div className="text-xs text-gray-600">Deliveries</div>
          </div>
          <div>
            <div className="text-lg font-bold text-indigo-600">
              {selectedRegion === 'all' ? '5' : '1'}
            </div>
            <div className="text-xs text-gray-600">Regions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriPayAfricaMap;