import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah K.',
      role: 'Maize Farmer, Kenya',
      image: '👩‍🌾',
      quote: 'AgriPay doubled my income by connecting me directly to buyers in Nairobi. No more middlemen!',
      stats: 'Income: +200%',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'James M.',
      role: 'Food Processor, Nigeria',
      image: '👨‍💼',
      quote: 'Sourcing directly from farmers cut my costs by 40%. The quality is consistently better.',
      stats: 'Costs: -40%',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Dr. Amina B.',
      role: 'Agricultural Expert, Ghana',
      image: '👩‍🔬',
      quote: 'I now consult with farmers across West Africa without leaving my office. Revolutionary!',
      stats: 'Reach: 5 Countries',
      color: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Chinedu O.',
      role: 'Logistics Partner, Rwanda',
      image: '👨‍✈️',
      quote: 'My delivery business grew 300% in 6 months through AgriPay. Consistent jobs, timely payments.',
      stats: 'Growth: +300%',
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-amber-50/30 to-white relative overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-amber-50/10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Real Stories from{' '}
            <span className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              Our Community
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how AgriPay is transforming lives and businesses across the African agricultural landscape.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-amber-100 transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Quote */}
              <div className="text-6xl text-amber-200 mb-4">"</div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {testimonial.image}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  <div className="bg-gradient-to-r from-green-500 to-yellow-500 text-white text-xs px-3 py-1 rounded-full inline-block mt-1 font-semibold">
                    {testimonial.stats}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-amber-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">68K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">$15M+</div>
              <div className="text-gray-600">Transactions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">18</div>
              <div className="text-gray-600">African Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;