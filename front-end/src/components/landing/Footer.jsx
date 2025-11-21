import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Top Pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
      
      {/* Background Elements */}
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* BKSH Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-yellow-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">AgriPay</h3>
                <p className="text-gray-400 text-sm">African Agricultural Revolution</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Transforming African agriculture through technology, community, and financial inclusion. Building a sustainable future for all stakeholders.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                📘
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                🐦
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                📷
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                💼
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-green-400 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-yellow-400 transition-colors">How It Works</a></li>
              <li><a href="#roles" className="text-gray-400 hover:text-red-400 transition-colors">Join Community</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-blue-400 transition-colors">Success Stories</a></li>
              <li><a href="/blog" className="text-gray-400 hover:text-purple-400 transition-colors">Blog & News</a></li>
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Join As</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Farmer</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Buyer</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Input Seller</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Expert</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Logistics</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <span>support@agripay.africa</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🏢</span>
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🌐</span>
                <span>Available across Africa</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 AgriPay Africa. All rights reserved. Building the future of African agriculture.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-red-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
