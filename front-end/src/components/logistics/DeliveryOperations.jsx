// src/components/logistics/DeliveryOperations.jsx
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  Clock, 
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  MoreVertical,
  Truck,
  User,
  Phone
} from 'lucide-react';
import PaystackPayment from '../payments/PaystackPayment'

const DeliveryOperations = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [showMPesaModal, setShowMPesaModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState({
    available: [],
    active: [],
    completed: []
  });

  useEffect(() => {
    // Mock data for delivery jobs
    setJobs({
      available: [
        {
          id: 'JOB-2848',
          customer: 'Fresh Farms Ltd',
          pickup: 'Kiambu, Green Farms',
          delivery: 'Nairobi, City Market',
          distance: '45 km',
          value: 12000,
          urgency: 'high',
          type: 'perishable',
          deadline: 'Today, 14:00',
          phoneNumber: '+254712345678'
        },
        {
          id: 'JOB-2849',
          customer: 'Mombasa Fish Co.',
          pickup: 'Mombasa Port',
          delivery: 'Westlands, Nairobi',
          distance: '485 km',
          value: 18500,
          urgency: 'medium',
          type: 'cold_chain',
          deadline: 'Tomorrow, 09:00',
          phoneNumber: '+254723456789'
        }
      ],
      active: [
        {
          id: 'JOB-2847',
          customer: 'Nairobi Market Hub',
          pickup: 'Thika, Farm A',
          delivery: 'Nairobi, Gikomba Market',
          distance: '35 km',
          value: 8500,
          status: 'in_transit',
          progress: 65,
          eta: '30 mins',
          phoneNumber: '+254734567890'
        }
      ],
      completed: [
        {
          id: 'JOB-2846',
          customer: 'Green Valley Produce',
          pickup: 'Limuru, Highlands',
          delivery: 'Nairobi, Karen',
          distance: '28 km',
          value: 6700,
          status: 'delivered',
          completionTime: '2 hours ago',
          rating: 5,
          phoneNumber: '+254745678901'
        }
      ]
    });
  }, []);

  const acceptJob = (job) => {
    setJobs(prev => ({
      available: prev.available.filter(j => j.id !== job.id),
      active: [...prev.active, { ...job, status: 'accepted', progress: 0 }],
      completed: prev.completed
    }));
  };

  const completeJob = (job) => {
    setSelectedJob(job);
    setShowMPesaModal(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    // Move job from active to completed
    setJobs(prev => ({
      available: prev.available,
      active: prev.active.filter(j => j.id !== selectedJob.id),
      completed: [...prev.completed, { 
        ...selectedJob, 
        status: 'delivered', 
        completionTime: 'Just now',
        rating: 5
      }]
    }));
    
    setShowMPesaModal(false);
    setSelectedJob(null);
    
    alert(`Delivery ${selectedJob.id} completed! Payment of KES ${paymentData.amount} received.`);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const JobCard = ({ job, showActions = true }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{job.id}</h3>
            {job.urgency && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                {job.urgency.toUpperCase()}
              </span>
            )}
            {job.type && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {job.type.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{job.customer}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-green-500" />
                <span>Pickup: {job.pickup}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>Delivery: {job.delivery}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Navigation className="h-4 w-4 text-blue-500" />
                <span>Distance: {job.distance}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Deadline: {job.deadline}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <span className="font-bold text-lg">KES {job.value.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {job.progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Delivery Progress</span>
                <span>{job.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${job.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex flex-col space-y-2 ml-4">
            {activeTab === 'available' && (
              <button
                onClick={() => acceptJob(job)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Accept Job
              </button>
            )}
            {activeTab === 'active' && (
              <button
                onClick={() => completeJob(job)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Complete Delivery
              </button>
            )}
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 p-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Operations</h1>
          <p className="text-gray-600 mt-1">Manage delivery jobs, track progress, and process payments</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Truck className="h-4 w-4" />
            <span>New Route</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.available.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.active.length}</p>
            </div>
            <Navigation className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.completed.length}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                KES {jobs.completed.reduce((sum, job) => sum + job.value, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'available', name: 'Available Jobs', count: jobs.available.length },
              { id: 'active', name: 'Active Deliveries', count: jobs.active.length },
              { id: 'completed', name: 'Completed', count: jobs.completed.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {jobs[activeTab].map(job => (
              <JobCard key={job.id} job={job} />
            ))}
            {jobs[activeTab].length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No {activeTab} jobs</h3>
                <p className="text-gray-600">Check back later for new delivery opportunities</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* M-Pesa Payment Modal */}
      {showMPesaModal && selectedJob && (
        <PaystackPayment
          amount={selectedJob.value}
          phoneNumber={selectedJob.phoneNumber}
          productName={`Delivery ${selectedJob.id}`}
          onSuccess={handlePaymentSuccess}
          onClose={() => {
            setShowMPesaModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default DeliveryOperations;
