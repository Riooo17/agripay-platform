import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '💰',
      title: 'M-Pesa Integration',
      description: 'Seamless mobile payments across Africa. Buy, sell, and transact with confidence.',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: '🗺️',
      title: 'Live AgriPay Map',
      description: 'Real-time mapping of farms, buyers, and services across the continent.',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: '🤝',
      title: 'Community Platform',
      description: 'Connect with farmers, experts, and buyers in your agricultural community.',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'AI-powered insights on prices, weather, and market trends.',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: '🚚',
      title: 'Logistics Network',
      description: 'Uber-like delivery system connecting farms to markets efficiently.',
      color: 'from-teal-500 to-green-600',
      bgColor: 'bg-teal-50'
    },
    {
      icon: '🛡️',
      title: 'Crop Insurance',
      description: 'Protect your harvest with affordable, accessible insurance products.',
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-amber-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              African Agriculture
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to thrive in the modern agricultural ecosystem, built specifically for Africa's unique challenges and opportunities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-amber-100 hover:border-amber-200 transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Icon */}
              <div className={`w-20 h-20 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Gradient Border Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border border-amber-200">
            <span className="text-2xl">🚀</span>
            <div className="text-left">
              <h4 className="font-semibold text-gray-800">Ready to Transform Your Agricultural Business?</h4>
              <p className="text-gray-600 text-sm">Join thousands of successful farmers and buyers</p>
            </div>
            <button className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold">
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;