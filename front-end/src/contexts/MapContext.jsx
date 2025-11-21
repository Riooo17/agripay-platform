import React, { createContext, useContext, useState, useEffect } from 'react';

const MapContext = createContext();

// Export ALL the hooks your dashboard needs
export const useMapContext = () => useContext(MapContext);
export const useMapFilters = () => useContext(MapContext);
export const useMapView = () => useContext(MapContext);
export const useMapData = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [filters, setFilters] = useState({ region: '', filter: '' });
  const [mapView, setMapView] = useState({ center: [0, 0], zoom: 8 });
  const [filteredData, setFilteredData] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Mock data
    setFilteredData([
      { id: 1, name: 'Farm A', location: [-1.2921, 36.8219], type: 'farm' }
    ]);
    setStats({ totalFarms: 47, activeClaims: 8 });
  }, []);

  const value = {
    filters,
    setFilters,
    mapView, 
    setMapView,
    filteredData,
    stats,
    setRegion: (region) => setFilters(prev => ({ ...prev, region })),
    setFilter: (filter) => setFilters(prev => ({ ...prev, filter }))
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;