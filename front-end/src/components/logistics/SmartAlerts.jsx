// src/components/logistics/CustomerHub.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Star as StarIcon, // Renamed import to avoid conflict
  Phone, 
  Mail, 
  MapPin,
  Package,
  Clock,
  TrendingUp,
  Filter,
  Search,
  MessageCircle,
  Award
} from 'lucide-react';

const CustomerHub = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock customers data
    setCustomers([
      {
        id: 1,
        name: 'Fresh Farms Ltd',
        contact: 'James Mwangi',
        phone: '+254712345678',
        email: 'james@freshfarms.co.ke',
        location: 'Kiambu',
        type: 'commercial',
        rating: 4.9,
        deliveries: 47,
        totalSpent: 385000,
        lastDelivery: '2024-01-20',
        status: 'active'
      },
      {
        id: 2,
        name: 'Nairobi Market Hub',
        contact: 'Sarah Otieno',
        phone: '+254723456789',
        email: 'sarah@nairobinarket.co.ke',
        location: 'Nairobi CBD',
        type: 'commercial',
        rating: 4.8,
        deliveries: 32,
        totalSpent: 256000,
        lastDelivery: '2024-01-19',
        status: 'active'
      },
      {
        id: 3,
        name: 'Green Valley Produce',
        contact: 'Michael Kimani',
        phone: '+254734567890',
        email: 'mike@greenvalley.ke',
        location: 'Limuru',
        type: 'commercial',
        rating: 4.7,
        deliveries: 28,
        totalSpent: 189000,
        lastDelivery: '2024-01-18',
        status: 'active'
      },
      {
        id: 4,
        name: 'Mombasa Fish Co.',
        contact: 'Aisha Hassan',
        phone: '+254745678901',
        email: 'aisha@mombasafish.co.ke',
        location: 'Mombasa',
        type: 'commercial',
        rating: 4.6,
        deliveries: 15,
        totalSpent: 112000,
        lastDelivery: '2024-01-17',
        status: 'active'
      }
    ]);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Custom Star component for ratings (different from lucide-react Star)
  const StarRating = ({ rating }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating})</span>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Hub</h1>
          <p className="text-gray-600 mt-1">Manage customer relationships and delivery history</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customers</h2>
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedCustomer?.id === customer.id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">{customer.contact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">{customer.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <StarRating rating={customer.rating} />
                      <span className="text-xs text-gray-500">{customer.deliveries} deliveries</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                  <p className="text-gray-600">{selectedCustomer.type} • {selectedCustomer.location}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <MessageCircle className="h-4 w-4" />
                    <span>Message</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-gray-700">Customer Rating</span>
                  </div>
                  <StarRating rating={selectedCustomer.rating} />
                  <p className="text-xs text-gray-600 mt-1">Based on {selectedCustomer.deliveries} deliveries</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-gray-700">Total Value</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">KES {selectedCustomer.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Lifetime value</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-700">Last Delivery</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{selectedCustomer.lastDelivery}</p>
                  <p className="text-xs text-gray-600">2 days ago</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedCustomer.contact}</p>
                        <p className="text-sm text-gray-600">Primary Contact</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedCustomer.phone}</p>
                        <p className="text-sm text-gray-600">Mobile</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
                        <p className="text-sm text-gray-600">Email</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedCustomer.location}</p>
                        <p className="text-sm text-gray-600">Location</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { id: 1, action: 'Delivery completed', date: '2024-01-20', amount: 8500 },
                      { id: 2, action: 'New rating received', date: '2024-01-20', amount: null },
                      { id: 3, action: 'Delivery completed', date: '2024-01-18', amount: 12000 },
                      { id: 4, action: 'Account updated', date: '2024-01-15', amount: null }
                    ].map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.date}</p>
                        </div>
                        {activity.amount && (
                          <span className="font-bold text-green-600">KES {activity.amount.toLocaleString()}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Customer</h3>
              <p className="text-gray-600">Choose a customer from the list to view details and manage their account</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHub;