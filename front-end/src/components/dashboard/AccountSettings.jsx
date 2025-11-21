// src/components/dashboard/AccountSettings.jsx
import React, { useState } from 'react';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@agribusiness.com',
    phone: '+254 712 345 678',
    company: 'Fresh Foods Ltd',
    location: 'Nairobi, Kenya'
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
        <h1 className="text-2xl font-bold text-green-800 mb-2">⚙️ Account Settings</h1>
        <p className="text-green-600">Manage your account preferences and settings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-green-100">
        <div className="border-b border-green-200">
          <nav className="flex -mb-px">
            {['profile', 'notifications', 'security', 'billing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-green-500 hover:text-green-700 hover:border-green-300'
                }`}
              >
                {tab === 'profile' && 'Profile'}
                {tab === 'notifications' && 'Notifications'}
                {tab === 'security' && 'Security'}
                {tab === 'billing' && 'Billing'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="max-w-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold text-green-900">Price Alerts</p>
                  <p className="text-green-600 text-sm">Get notified when prices change</p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold text-green-900">Order Updates</p>
                  <p className="text-green-600 text-sm">Receive order status updates</p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold text-green-900">New Suppliers</p>
                  <p className="text-green-600 text-sm">Notifications about new suppliers</p>
                </div>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;