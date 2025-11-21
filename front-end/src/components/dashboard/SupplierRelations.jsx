// src/components/dashboard/SupplierRelations.jsx
import React, { useState, useEffect } from 'react';
import { buyerService } from '../../services/buyerService';

const SupplierRelations = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [favoriteSuppliers, setFavoriteSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Load real supplier data from backend
  useEffect(() => {
    const loadSupplierData = async () => {
      setLoading(true);
      console.log('🔄 Loading real supplier data...');
      
      try {
        // Load dashboard data which contains favoriteSuppliers
        const dashboardData = await buyerService.getDashboardData();
        
        if (dashboardData && dashboardData.favoriteSuppliers) {
          setFavoriteSuppliers(dashboardData.favoriteSuppliers);
          console.log('✅ Favorite suppliers loaded:', dashboardData.favoriteSuppliers.length);
        }

        // For demo, we'll create suppliers from favoriteSuppliers
        // In real app, you'd have /api/buyer/suppliers endpoint
        if (dashboardData && dashboardData.favoriteSuppliers) {
          const supplierData = dashboardData.favoriteSuppliers.map((supplier, index) => ({
            id: supplier._id || supplier.id || `supplier-${index}`,
            name: supplier.name || supplier.businessName || 'Agricultural Supplier',
            location: supplier.location || supplier.address || 'Kenya',
            rating: supplier.rating || 4.5 + (Math.KSHom() * 0.5),
            products: supplier.products || ['Agricultural Products'],
            joined: supplier.joinedDate || supplier.createdAt || '2024-01-01',
            orders: supplier.orderCount || Math.floor(Math.KSHom() * 20) + 1,
            responseTime: supplier.responseTime || '2-4 hours',
            phone: supplier.phone || supplier.contact || '+254 700 000 000',
            email: supplier.email || 'supplier@agripay.com',
            isFavorite: true
          }));
          
          setSuppliers(supplierData);
          console.log('✅ Supplier data loaded:', supplierData.length, 'suppliers');
        } else {
          console.log('ℹ️ No supplier data found');
          setSuppliers([]);
        }
      } catch (error) {
        console.error('❌ Failed to load supplier data:', error);
        setSuppliers([]);
        setFavoriteSuppliers([]);
      } finally {
        setLoading(false);
      }
    };

    loadSupplierData();
  }, []);

  const handleMessage = (supplier) => {
    setSelectedSupplier(supplier);
    setMessage(`Hello ${supplier.name}, I'm interested in your products and would like to discuss potential orders. Could you please share your current availability and pricing?`);
  };

  const sendMessage = async () => {
    if (message.trim() && selectedSupplier) {
      try {
        // In real app, you'd call an API to send message
        console.log('📧 Sending message to supplier:', selectedSupplier.name, message);
        alert(`📧 Message sent to ${selectedSupplier.name}! They typically respond within ${selectedSupplier.responseTime}.`);
        setSelectedSupplier(null);
        setMessage('');
      } catch (error) {
        alert('❌ Failed to send message. Please try again.');
      }
    }
  };

  const handleCall = (phone) => {
    alert(`📞 Calling ${phone}...\n\nIn a real app, this would initiate a phone call.`);
  };

  const handleSaveSupplier = async (supplierId) => {
    try {
      // In real app, you'd call an API to add to favorites
      console.log('💾 Saving supplier to favorites:', supplierId);
      alert(`✅ Supplier saved to favorites!`);
      
      // Update local state
      setSuppliers(suppliers.map(supplier => 
        supplier.id === supplierId 
          ? { ...supplier, isFavorite: true }
          : supplier
      ));
    } catch (error) {
      alert('❌ Failed to save supplier. Please try again.');
    }
  };

  const handleRemoveFavorite = async (supplierId) => {
    try {
      // In real app, you'd call an API to remove from favorites
      console.log('🗑️ Removing supplier from favorites:', supplierId);
      alert(`✅ Supplier removed from favorites.`);
      
      // Update local state
      setSuppliers(suppliers.map(supplier => 
        supplier.id === supplierId 
          ? { ...supplier, isFavorite: false }
          : supplier
      ));
    } catch (error) {
      alert('❌ Failed to remove supplier. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short'
    });
  };

  // Filter suppliers based on active tab
  const filteredSuppliers = suppliers.filter(supplier => {
    if (activeTab === 'favorites') {
      return supplier.isFavorite;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <h1 className="text-2xl font-bold text-green-800 mb-2">🤝 Supplier Relations</h1>
          <p className="text-green-600">Loading supplier network...</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-green-800 font-semibold">Loading trusted suppliers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
        <h1 className="text-2xl font-bold text-green-800 mb-2">🤝 Supplier Relations</h1>
        <p className="text-green-600">Connect with trusted agricultural suppliers across Africa</p>
        
        {/* Supplier Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm">Total Suppliers</p>
            <p className="text-2xl font-bold text-green-800">{suppliers.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-600 text-sm">Favorites</p>
            <p className="text-2xl font-bold text-yellow-800">
              {suppliers.filter(s => s.isFavorite).length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm">Active Orders</p>
            <p className="text-2xl font-bold text-blue-800">
              {suppliers.reduce((sum, supplier) => sum + supplier.orders, 0)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-purple-600 text-sm">Avg Rating</p>
            <p className="text-2xl font-bold text-purple-800">
              {(suppliers.reduce((sum, supplier) => sum + supplier.rating, 0) / suppliers.length || 0).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-green-100">
        <div className="border-b border-green-200">
          <nav className="flex -mb-px">
            {['all', 'favorites'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-green-500 hover:text-green-700 hover:border-green-300'
                }`}
              >
                {tab === 'all' && `All Suppliers (${suppliers.length})`}
                {tab === 'favorites' && `Favorites (${suppliers.filter(s => s.isFavorite).length})`}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {filteredSuppliers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map(supplier => (
                <div key={supplier.id} className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-green-900 text-lg">{supplier.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                        <span className="text-yellow-800 text-sm font-medium">{supplier.rating.toFixed(1)}</span>
                        <span className="text-yellow-600 ml-1">⭐</span>
                      </div>
                      {supplier.isFavorite ? (
                        <button 
                          onClick={() => handleRemoveFavorite(supplier.id)}
                          className="text-red-500 hover:text-red-700 text-lg"
                          title="Remove from favorites"
                        >
                          ❤️
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSaveSupplier(supplier.id)}
                          className="text-gray-400 hover:text-red-500 text-lg"
                          title="Add to favorites"
                        >
                          ♡
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-green-600 text-sm mb-4">{supplier.location}</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-green-700 text-sm font-medium">Products:</p>
                    <div className="flex flex-wrap gap-1">
                      {supplier.products.map((product, index) => (
                        <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-green-600 mb-4">
                    <div className="flex justify-between">
                      <span>Orders:</span>
                      <span className="font-semibold">{supplier.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-semibold">{supplier.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Member Since:</span>
                      <span className="font-semibold">{formatDate(supplier.joined)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleMessage(supplier)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      📧 Message
                    </button>
                    <button 
                      onClick={() => handleCall(supplier.phone)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      title={`Call ${supplier.phone}`}
                    >
                      📞
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {activeTab === 'favorites' ? 'No Favorite Suppliers' : 'No Suppliers Available'}
              </h3>
              <p className="text-green-600">
                {activeTab === 'favorites' 
                  ? 'Start adding suppliers to your favorites to see them here.' 
                  : 'Suppliers will appear here as they join the platform.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Supplier Benefits */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">🌟 Why Work with Our Suppliers?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <p className="font-semibold">Verified Quality</p>
            <p className="text-sm opacity-90 mt-1">All suppliers are quality-checked</p>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg">
            <div className="text-2xl mb-2">🚚</div>
            <p className="font-semibold">Reliable Delivery</p>
            <p className="text-sm opacity-90 mt-1">Timely delivery guaranteed</p>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg">
            <div className="text-2xl mb-2">💬</div>
            <p className="font-semibold">Direct Communication</p>
            <p className="text-sm opacity-90 mt-1">Chat directly with suppliers</p>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setSelectedSupplier(null)} />
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-green-900">
                          Message {selectedSupplier.name}
                        </h3>
                        <p className="text-green-600 text-sm mt-1">
                          Typically responds within {selectedSupplier.responseTime}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedSupplier(null)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">
                          Your Message
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows="4"
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Type your message here..."
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={sendMessage}
                          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
                        >
                          Send Message
                        </button>
                        <button
                          onClick={() => setSelectedSupplier(null)}
                          className="px-6 py-3 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
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

export default SupplierRelations;
