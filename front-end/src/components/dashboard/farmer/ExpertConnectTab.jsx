import React, { useState, useEffect } from 'react';
import farmerApi from '../../../services/farmerApi';

const ExpertConnectTab = ({ dashboardData, onDataUpdate }) => {
  const [experts, setExperts] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [activeTab, setActiveTab] = useState('experts');
  const [actionLoading, setActionLoading] = useState('');

  // Consultation form state
  const [consultationForm, setConsultationForm] = useState({
    expertId: '',
    subject: '',
    description: '',
    urgency: 'medium',
    preferredDate: '',
    preferredTime: '',
    budget: ''
  });

  // Load data
  useEffect(() => {
    loadExpertData();
  }, []);

  const loadExpertData = async () => {
    try {
      setLoading(true);
      const [expertsRes, consultationsRes] = await Promise.all([
        farmerApi.getExperts(),
        farmerApi.getConsultations()
      ]);
      
      setExperts(expertsRes.data || []);
      setConsultations(consultationsRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle consultation request
  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    setActionLoading('consultation');

    try {
      await farmerApi.createConsultation(consultationForm);
      alert('Consultation request submitted successfully!');
      setShowConsultationForm(false);
      setConsultationForm({
        expertId: '',
        subject: '',
        description: '',
        urgency: 'medium',
        preferredDate: '',
        preferredTime: '',
        budget: ''
      });
      loadExpertData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading('');
    }
  };

  // Start consultation with expert
  const handleStartConsultation = (expert) => {
    setSelectedExpert(expert);
    setConsultationForm(prev => ({
      ...prev,
      expertId: expert.id,
      subject: `Consultation with ${expert.name}`
    }));
    setShowConsultationForm(true);
  };

  // Cancel consultation
  const handleCancelConsultation = async (consultationId) => {
    if (!confirm('Are you sure you want to cancel this consultation?')) {
      return;
    }

    setActionLoading(`cancel-${consultationId}`);
    try {
      await farmerApi.updateConsultation(consultationId, { status: 'cancelled' });
      alert('Consultation cancelled successfully!');
      loadExpertData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading('');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expert network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expert Connect</h1>
          <p className="text-gray-600">Get professional advice from agricultural experts</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadExpertData}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('experts')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'experts'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            👨‍🌾 Available Experts
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'consultations'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📅 My Consultations
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'knowledge'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📚 Knowledge Base
          </button>
        </div>

        <div className="p-6">
          {/* Available Experts Tab */}
          {activeTab === 'experts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Available Agricultural Experts</h2>
                <div className="text-sm text-gray-500">
                  {experts.length} experts available
                </div>
              </div>

              {error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 font-semibold mb-2">Error Loading Experts</div>
                  <button
                    onClick={loadExpertData}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : experts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👨‍🌾</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Experts Available</h3>
                  <p className="text-gray-600">Check back later for available agricultural experts</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experts.map((expert) => (
                    <div key={expert.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">👨‍🌾</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{expert.name}</h3>
                        <p className="text-sm text-gray-600">{expert.specialization}</p>
                        <div className="flex items-center justify-center space-x-1 mt-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm text-gray-600">{expert.rating}</span>
                          <span className="text-sm text-gray-500">({expert.reviews} reviews)</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Experience:</span>
                          <span className="font-medium">{expert.experience} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Consultations:</span>
                          <span className="font-medium">{expert.consultationsCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span className="font-medium">{expert.responseTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fee:</span>
                          <span className="font-medium text-green-600">₹{expert.fee}/session</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{expert.bio}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {expert.skills?.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                        {expert.skills?.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{expert.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartConsultation(expert)}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors text-sm"
                        >
                          Consult Now
                        </button>
                        <button className="bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition-colors text-sm">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Consultations Tab */}
          {activeTab === 'consultations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">My Consultation Requests</h2>
                <button
                  onClick={() => setShowConsultationForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + New Consultation
                </button>
              </div>

              {consultations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Consultations Yet</h3>
                  <p className="text-gray-600 mb-4">Get started by requesting your first consultation</p>
                  <button
                    onClick={() => setShowConsultationForm(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Request Consultation
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <div key={consultation.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{consultation.subject}</h3>
                              <p className="text-sm text-gray-600">
                                with {consultation.expert?.name} • {consultation.expert?.specialization}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                                {consultation.status.toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(consultation.urgency)}`}>
                                {consultation.urgency.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {consultation.description}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Requested:</span>
                              <span className="ml-2 text-gray-900">
                                {new Date(consultation.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Budget:</span>
                              <span className="ml-2 text-gray-900 font-semibold">
                                ₹{consultation.budget}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Scheduled:</span>
                              <span className="ml-2 text-gray-900">
                                {consultation.scheduledDate 
                                  ? new Date(consultation.scheduledDate).toLocaleDateString()
                                  : 'Not scheduled'
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          {consultation.status === 'pending' && (
                            <button
                              onClick={() => handleCancelConsultation(consultation.id)}
                              disabled={actionLoading === `cancel-${consultation.id}`}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
                            >
                              {actionLoading === `cancel-${consultation.id}` ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                              ) : (
                                'Cancel'
                              )}
                            </button>
                          )}
                          
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            View Details
                          </button>
                          
                          {(consultation.status === 'accepted' || consultation.status === 'scheduled') && (
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                              Join Session
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Knowledge Base Tab */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Agricultural Knowledge Base</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Knowledge Cards */}
                {[
                  { title: 'Crop Rotation Guide', icon: '🔄', category: 'Farming Techniques' },
                  { title: 'Soil Health Management', icon: '🌱', category: 'Soil Science' },
                  { title: 'Pest Control Methods', icon: '🐛', category: 'Pest Management' },
                  { title: 'Irrigation Best Practices', icon: '💧', category: 'Water Management' },
                  { title: 'Organic Farming Guide', icon: '🍃', category: 'Sustainable Farming' },
                  { title: 'Market Price Trends', icon: '📈', category: 'Market Insights' }
                ].map((item, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                    <button className="w-full bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors text-sm">
                      Read Guide
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Need Immediate Help?</h3>
                <p className="text-blue-800 mb-4">
                  Connect with an expert for personalized advice on your specific farming challenges.
                </p>
                <button
                  onClick={() => setActiveTab('experts')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Find an Expert
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Consultation Request Modal */}
      {showConsultationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {selectedExpert ? `Consult with ${selectedExpert.name}` : 'Request Consultation'}
                </h2>
                <button
                  onClick={() => {
                    setShowConsultationForm(false);
                    setSelectedExpert(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConsultationSubmit} className="space-y-6">
                {!selectedExpert && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Expert
                    </label>
                    <select
                      value={consultationForm.expertId}
                      onChange={(e) => setConsultationForm(prev => ({ ...prev, expertId: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Choose an expert...</option>
                      {experts.map(expert => (
                        <option key={expert.id} value={expert.id}>
                          {expert.name} - {expert.specialization} (₹{expert.fee}/session)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={consultationForm.subject}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Brief subject of your consultation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={consultationForm.description}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows="4"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your farming challenge or question in detail..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <select
                      value={consultationForm.urgency}
                      onChange={(e) => setConsultationForm(prev => ({ ...prev, urgency: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="low">Low - General Advice</option>
                      <option value="medium">Medium - Important Issue</option>
                      <option value="high">High - Urgent Problem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={consultationForm.budget}
                      onChange={(e) => setConsultationForm(prev => ({ ...prev, budget: e.target.value }))}
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your budget"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={consultationForm.preferredDate}
                      onChange={(e) => setConsultationForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      value={consultationForm.preferredTime}
                      onChange={(e) => setConsultationForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading === 'consultation' ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowConsultationForm(false);
                      setSelectedExpert(null);
                    }}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertConnectTab;