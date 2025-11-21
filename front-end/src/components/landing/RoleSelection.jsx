import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = ({ onRoleSelect, selectedRole, isInAuthFlow = false }) => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'farmer',
      icon: '👨‍🌾',
      title: 'Farmer',
      description: 'Sell your produce, access markets, get expert advice, and secure financing.',
      color: 'from-green-500 to-emerald-600',
      stats: '50K+ Farmers',
      features: ['Sell Products', 'Get Expert Help', 'Access Loans', 'Market Insights']
    },
    {
      id: 'buyer',
      icon: '🛒',
      title: 'Buyer',
      description: 'Source quality produce directly from farmers across Africa with guaranteed delivery.',
      color: 'from-blue-500 to-cyan-600',
      stats: '15K+ Buyers',
      features: ['Direct Sourcing', 'Quality Assurance', 'Logistics', 'Bulk Discounts']
    },
    {
      id: 'input_seller',
      icon: '🏪',
      title: 'Input Seller',
      description: 'Reach thousands of farmers with your seeds, fertilizers, and equipment.',
      color: 'from-purple-500 to-pink-600',
      stats: '2K+ Suppliers',
      features: ['Wider Reach', 'Digital Store', 'Payment Security', 'Delivery Network']
    },
    {
      id: 'expert',
      icon: '🎓',
      title: 'Agricultural Expert',
      description: 'Share your knowledge, consult with farmers, and build your reputation.',
      color: 'from-orange-500 to-red-600',
      stats: '500+ Experts',
      features: ['Consultation Platform', 'Knowledge Sharing', 'Build Reputation', 'Earn Income']
    },
    {
      id: 'logistics',
      icon: '🚚',
      title: 'Logistics Provider',
      description: 'Join our delivery network and serve the agricultural supply chain.',
      color: 'from-teal-500 to-green-600',
      stats: '300+ Partners',
      features: ['Delivery Jobs', 'Route Optimization', 'Secure Payments', 'Fleet Management']
    },
    {
      id: 'financial',
      icon: '🏦',
      title: 'Financial Institution',
      description: 'Offer loans, insurance, and financial products to verified agricultural businesses.',
      color: 'from-amber-500 to-yellow-600',
      stats: '50+ Partners',
      features: ['Verified Clients', 'Low Risk', 'Digital Processing', 'Market Data']
    }
  ];

  const handleRoleClick = (roleId) => {
    if (isInAuthFlow && onRoleSelect) {
      // In auth flow - use the callback
      onRoleSelect(roleId);
    } else if (!isInAuthFlow) {
      // On landing page - navigate to auth
      navigate('/auth', { state: { selectedRole: roleId } });
    }
  };

  // Simplified version for auth flow
  if (isInAuthFlow) {
    return (
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Choose Your Role in AgriPay
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleClick(role.id)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedRole === role.id
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-amber-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center text-white text-lg`}>
                  {role.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{role.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{role.description}</p>
                </div>
                {selectedRole === role.id && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full featured version for landing page
  return (
    <section id="roles" className="py-20 bg-gradient-to-b from-white to-green-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Join Africa's Agricultural{' '}
            <span className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              Revolution
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose your role in the ecosystem and start your journey toward agricultural excellence and financial freedom.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {roles.map((role, index) => (
            <div 
              key={index}
              className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-amber-100 hover:border-green-200 transition-all duration-500 transform hover:-translate-y-3 cursor-pointer"
              onClick={() => handleRoleClick(role.id)}
            >
              {/* Role Header */}
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${role.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-3xl">{role.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{role.title}</h3>
                <p className="text-green-600 font-semibold">{role.stats}</p>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                {role.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {role.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transform group-hover:scale-105 transition-all duration-300 font-semibold">
                Join as {role.title}
              </button>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Unified CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-yellow-500 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform African Agriculture Together?</h3>
            <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
              Join over 68,000 agricultural professionals who are already building the future of food security in Africa.
            </p>
            <button 
              onClick={() => navigate('/auth')}
              className="bg-white text-green-600 px-12 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-lg"
            >
              Start Your Journey Today 🚀
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;