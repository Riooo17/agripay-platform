import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="relative bg-white/80 backdrop-blur-md border-b border-amber-200 shadow-sm">
      {/* African Pattern Border */}
      <div className="h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-green-600"></div>
      
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-yellow-500 rounded-2xl transform rotate-12 group-hover:rotate-0 transition-transform duration-300 shadow-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                AgriPay
              </h1>
              <p className="text-xs text-gray-600 -mt-1">African Agricultural Revolution</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors duration-300 font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-yellow-600 transition-colors duration-300 font-medium">
              How It Works
            </a>
            <a href="#roles" className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium">
              Join As
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium">
              Stories
            </a>
            <a href="/blog" className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium">
              Blog
            </a>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/auth?type=login')}
                className="px-6 py-2 text-gray-700 border border-amber-400 rounded-full hover:bg-amber-50 transition-all duration-300 font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-700"></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-amber-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-green-600 py-2">Features</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-yellow-600 py-2">How It Works</a>
              <a href="#roles" className="block text-gray-700 hover:text-red-600 py-2">Join As</a>
              <a href="#testimonials" className="block text-gray-700 hover:text-blue-600 py-2">Stories</a>
              <a href="/blog" className="block text-gray-700 hover:text-purple-600 py-2">Blog</a>
              <div className="pt-4 space-y-3">
                <button className="w-full py-2 text-gray-700 border border-amber-400 rounded-full hover:bg-amber-50">Sign In</button>
                <button className="w-full py-2 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-full hover:shadow-lg">Get Started</button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;