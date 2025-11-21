import React, { useState, useEffect } from 'react';
import farmerApi from '../../../services/farmerApi';

const FarmProfileTab = ({ dashboardData, onDataUpdate }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    farmName: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    farmSize: 'medium',
    crops: [],
    newCrop: ''
  });

  // Load profile
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await farmerApi.getProfile();
      const profileData = response.data;
      setProfile(profileData);
      
      // Initialize form with profile data
      setProfileForm({
        farmName: profileData.farmName || '',
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.contact?.phone || '',
        address: profileData.location?.address || '',
        city: profileData.location?.city || '',
        state: profileData.location?.state || '',
        pincode: profileData.location?.pincode || '',
        farmSize: profileData.farmSize || 'medium',
        crops: profileData.crops || [],
        newCrop: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add crop
  const handleAddCrop = () => {
    if (profileForm.newCrop.trim() && !profileForm.crops.includes(profileForm.newCrop.trim())) {
      setProfileForm(prev => ({
        ...prev,
        crops: [...prev.crops, prev.newCrop.trim()],
        newCrop: ''
      }));
    }
  };

  // Remove crop
  const handleRemoveCrop = (cropToRemove) => {
    setProfileForm(prev => ({
      ...prev,
      crops: prev.crops.filter(crop => crop !== cropToRemove)
    }));
  };

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    try {
      const profileData = {
        farmName: profileForm.farmName,
        name: profileForm.name,
        contact: {
          phone: profileForm.phone
        },
        location: {
          address: profileForm.address,
          city: profileForm.city,
          state: profileForm.state,
          pincode: profileForm.pincode
        },
        farmSize: profileForm.farmSize,
        crops: profileForm.crops
      };

      await farmerApi.updateProfile(profileData);
      alert('Profile updated successfully!');
      setEditing(false);
      loadProfile();
      onDataUpdate(); // Refresh dashboard
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditing(false);
    // Reset form to original profile data
    if (profile) {
      setProfileForm({
        farmName: profile.farmName || '',
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.contact?.phone || '',
        address: profile.location?.address || '',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        pincode: profile.location?.pincode || '',
        farmSize: profile.farmSize || 'medium',
        crops: profile.crops || [],
        newCrop: ''
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your farm profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farm Profile</h1>
          <p className="text-gray-600">Manage your farm information and settings</p>
        </div>
        
        <div className="flex gap-2">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>✏️</span>
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <span>💾</span>
                )}
                <span>Save Changes</span>
              </button>
              
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          
          <button
            onClick={loadProfile}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-semibold mb-2">Error Loading Profile</div>
          <div className="text-red-500 text-sm mb-4">{error}</div>
          <button
            onClick={loadProfile}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4 space-y-2">
              {['basic', 'location', 'crops', 'settings'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium capitalize">
                    {section === 'basic' && '👤 Basic Info'}
                    {section === 'location' && '📍 Location'}
                    {section === 'crops' && '🌱 Crops'}
                    {section === 'settings' && '⚙️ Settings'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border p-6">
              {/* Basic Information */}
              {activeSection === 'basic' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Farm Name *
                      </label>
                      <input
                        type="text"
                        name="farmName"
                        value={profileForm.farmName}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileForm.name}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Farm Size
                      </label>
                      <select
                        name="farmSize"
                        value={profileForm.farmSize}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                      >
                        <option value="small">Small (0-5 acres)</option>
                        <option value="medium">Medium (5-20 acres)</option>
                        <option value="large">Large (20+ acres)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Information */}
              {activeSection === 'location' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Location Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={profileForm.address}
                        onChange={handleInputChange}
                        disabled={!editing}
                        rows="3"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profileForm.city}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={profileForm.state}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={profileForm.pincode}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Crops Management */}
              {activeSection === 'crops' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Crops Management</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add New Crop
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={profileForm.newCrop}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, newCrop: e.target.value }))}
                          disabled={!editing}
                          placeholder="Enter crop name"
                          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                        <button
                          onClick={handleAddCrop}
                          disabled={!editing || !profileForm.newCrop.trim()}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Crops ({profileForm.crops.length})
                      </label>
                      {profileForm.crops.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                          <div className="text-4xl mb-2">🌱</div>
                          <p className="text-gray-500">No crops added yet</p>
                          <p className="text-sm text-gray-400">Add the crops you grow on your farm</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {profileForm.crops.map((crop, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="font-medium">{crop}</span>
                              {editing && (
                                <button
                                  onClick={() => handleRemoveCrop(crop)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Settings */}
              {activeSection === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-3">Notification Preferences</h3>
                      <div className="space-y-3">
                        {['Order notifications', 'Price alerts', 'Weather updates', 'Expert advice'].map((pref) => (
                          <div key={pref} className="flex items-center justify-between">
                            <span className="text-gray-700">{pref}</span>
                            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                              <span className="sr-only">Toggle {pref}</span>
                              <span aria-hidden="true" className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0"></span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-3">Danger Zone</h3>
                      <div className="space-y-3">
                        <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-left">
                          🗑️ Delete Account
                        </button>
                        <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-left">
                          🔒 Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmProfileTab;