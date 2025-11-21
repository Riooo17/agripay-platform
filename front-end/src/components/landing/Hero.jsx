import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern - Simplified */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-emerald-50/30"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-700 via-yellow-600 to-red-600 bg-clip-text text-transparent">
              Revolutionizing
            </span>
            <br />
            <span className="text-gray-800">African Agriculture</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Where <span className="text-green-600 font-semibold">farmers</span>,{' '}
            <span className="text-yellow-600 font-semibold">buyers</span>, and{' '}
            <span className="text-red-600 font-semibold">experts</span> unite to build the future of food security in Africa
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-amber-200">
            <div className="text-2xl font-bold text-green-700">50K+</div>
            <div className="text-sm text-gray-600">Farmers Empowered</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-amber-200">
            <div className="text-2xl font-bold text-yellow-600">$10M+</div>
            <div className="text-sm text-gray-600">Transactions Processed</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-amber-200">
            <div className="text-2xl font-bold text-red-600">15+</div>
            <div className="text-sm text-gray-600">African Countries</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button 
            onClick={() => navigate('/auth')}
            className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-lg overflow-hidden"
          >
            <span className="relative z-10">Start Your Journey →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button className="px-8 py-4 border-2 border-amber-400 text-amber-700 rounded-full hover:bg-amber-50 transition-all duration-300 font-semibold text-lg group">
            <span className="flex items-center space-x-2">
              <span>Watch Our Story</span>
              <span className="group-hover:translate-x-1 transition-transform">🎬</span>
            </span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Scroll to explore</p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-20 left-10 animate-float">
        <div className="w-20 h-20 bg-green-200 rounded-full opacity-60"></div>
      </div>
      <div className="absolute top-40 right-10 animate-float delay-1000">
        <div className="w-16 h-16 bg-yellow-200 rounded-full opacity-60"></div>
      </div>
      <div className="absolute top-1/4 left-1/4 animate-float delay-500">
        <div className="w-12 h-12 bg-red-200 rounded-full opacity-60"></div>
      </div>
    </section>
  );
};

export default Hero;