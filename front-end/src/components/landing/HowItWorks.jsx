import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Role',
      description: 'Join as a Farmer, Buyer, Expert, Input Seller, Logistics Provider, or Financial Institution.',
      icon: '👤',
      color: 'from-purple-500 to-pink-500',
      details: ['Select your primary role', 'Customize your profile', 'Set your preferences']
    },
    {
      number: '02',
      title: 'Set Up Your Profile',
      description: 'Create your digital identity with verification and M-Pesa integration for seamless transactions.',
      icon: '🛠️',
      color: 'from-blue-500 to-cyan-500',
      details: ['Verify your identity', 'Connect M-Pesa', 'Add location details']
    },
    {
      number: '03',
      title: 'Explore the Ecosystem',
      description: 'Access our integrated marketplace, community forums, and real-time AgriPay Map.',
      icon: '🌍',
      color: 'from-green-500 to-emerald-500',
      details: ['Browse marketplace', 'Join communities', 'Use AgriPay Map']
    },
    {
      number: '04',
      title: 'Start Transacting',
      description: 'Buy, sell, consult, deliver, or invest - all within our secure, integrated platform.',
      icon: '💰',
      color: 'from-orange-500 to-red-500',
      details: ['Make secure payments', 'Track transactions', 'Get real-time updates']
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-amber-50/30 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-9xl">🌱</div>
        <div className="absolute bottom-20 right-10 text-9xl">🚜</div>
        <div className="absolute top-1/2 left-1/4 text-9xl">💰</div>
        <div className="absolute top-1/3 right-1/4 text-9xl">🗺️</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Simple Steps to{' '}
            <span className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              Agricultural Success
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From registration to your first transaction - we've made the journey smooth and rewarding for every African agricultural stakeholder.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col lg:flex-row items-center mb-16 last:mb-0">
              {/* Step Content */}
              <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} p-8`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
                  {/* Step Header */}
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                      {step.number}
                    </div>
                    <div className="ml-6">
                      <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-2xl mr-2">{step.icon}</span>
                        <div className="h-1 w-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Details List */}
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Visual Separator */}
              <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} relative p-8`}>
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-32 bg-gradient-to-b from-amber-400 to-orange-500"></div>
                )}
                
                {/* Step Visual */}
                <div className="relative">
                  <div className={`w-48 h-48 mx-auto rounded-3xl bg-gradient-to-br ${step.color} opacity-20 transform rotate-12`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl transform -rotate-12">
                      {step.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-amber-200">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-gray-800 mb-2">Your AgriPay Journey</h4>
            <p className="text-gray-600">Most users complete setup in under 10 minutes</p>
          </div>
          
          <div className="bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '0%' }}
              id="progress-bar"
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Start</span>
            <span>Profile Setup</span>
            <span>Explore</span>
            <span>Success! 🎉</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;