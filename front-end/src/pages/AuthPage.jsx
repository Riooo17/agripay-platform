import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RoleSelection from '../components/landing/RoleSelection';
import RegistrationForm from '../components/auth/RegistrationForm';
import LoginForm from '../components/auth/LoginForm';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  
  const [authMode, setAuthMode] = useState(location.search.includes('type=login') ? 'login' : 'role-selection');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Pre-select role if coming from landing page
  React.useEffect(() => {
    if (location.state?.selectedRole) {
      setSelectedRole(location.state.selectedRole);
      setAuthMode('register');
    }
  }, [location.state]);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setAuthMode('register');
    setAuthError('');
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setAuthMode('role-selection');
    setAuthError('');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
    setAuthError('');
  };

  const handleSwitchToRegister = () => {
    if (selectedRole) {
      setAuthMode('register');
    } else {
      setAuthMode('role-selection');
    }
    setAuthError('');
  };

  const handleLogin = async (loginData) => {
    setIsLoading(true);
    setAuthError('');
    
    const result = await login(loginData.email, loginData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setAuthError(result.error || 'Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (registerData) => {
    setIsLoading(true);
    setAuthError('');
    
    const result = await register(registerData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setAuthError(result.error || 'Registration failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  const getRoleTitle = () => {
    const roleTitles = {
      farmer: 'Farmer',
      buyer: 'Buyer',
      input_seller: 'Input Seller',
      expert: 'Agricultural Expert',
      logistics: 'Logistics Provider',
      financial: 'Financial Institution'
    };
    return roleTitles[selectedRole] || 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-6">
      {/* Background African Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
        
        {/* African Pattern Overlay */}
        <div className="absolute inset-0 bg-repeat opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d97706' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div 
            className="flex items-center justify-center space-x-4 cursor-pointer group mb-6"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 via-yellow-500 to-red-500 rounded-3xl transform rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🌱</span>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                AgriPay
              </h1>
              <p className="text-amber-700 font-medium text-lg -mt-1">African Agricultural Revolution</p>
            </div>
          </div>
        </div>

        {/* Expanded Main Auth Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-4xl shadow-2xl border border-amber-200/50 overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-5">
            {/* Left Side - Enhanced Form Section (3/5 width) */}
            <div className="xl:col-span-3 p-10 xl:p-16">
              {authMode === 'role-selection' && (
                <div>
                  <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-gray-800 mb-3">Join the AgriPay Revolution</h2>
                    <p className="text-xl text-amber-600 max-w-2xl mx-auto leading-relaxed">
                      Choose your role and become part of Africa's agricultural transformation
                    </p>
                  </div>
                  <RoleSelection 
                    onRoleSelect={handleRoleSelect} 
                    selectedRole={selectedRole}
                    isInAuthFlow={true}
                  />
                  <div className="text-center mt-10 pt-8 border-t border-amber-100">
                    <p className="text-gray-600 text-lg">
                      Already part of our community?{' '}
                      <button
                        onClick={handleSwitchToLogin}
                        className="text-green-600 hover:text-green-700 font-semibold text-lg underline underline-offset-4"
                      >
                        Sign in to your account
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {authMode === 'register' && selectedRole && (
                <div>
                  <div className="flex items-center space-x-6 mb-10">
                    <button
                      onClick={handleBackToRoleSelection}
                      className="w-12 h-12 rounded-2xl border-2 border-amber-300 flex items-center justify-center hover:bg-amber-50 transition-all duration-300 text-amber-600 hover:scale-110"
                    >
                      ←
                    </button>
                    <div>
                      <h2 className="text-4xl font-bold text-gray-800">Create Your Account</h2>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="px-4 py-1 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-full text-sm font-semibold">
                          {getRoleTitle()}
                        </span>
                        <p className="text-amber-600 text-lg">Join as a valued community member</p>
                      </div>
                    </div>
                  </div>
                  <RegistrationForm
                    selectedRole={selectedRole}
                    onBack={handleBackToRoleSelection}
                    onSubmit={handleRegister}
                  />
                </div>
              )}

              {authMode === 'login' && (
                <div>
                  <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-gray-800 mb-3">Welcome Back</h2>
                    <p className="text-xl text-amber-600">Sign in to continue your agricultural journey</p>
                  </div>
                  <LoginForm
                    onSwitchToRegister={handleSwitchToRegister}
                    onSubmit={handleLogin}
                    isLoading={isLoading}
                  />
                </div>
              )}

              {/* Enhanced Error Message */}
              {authError && (
                <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">!</span>
                    </div>
                    <p className="text-red-700 text-lg font-medium">{authError}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Enhanced Visual Section (2/5 width) */}
            <div className="xl:col-span-2 bg-gradient-to-br from-green-600 via-yellow-500 to-red-500 p-12 xl:p-16 text-white relative overflow-hidden">
              {/* Floating Elements */}
              <div className="absolute top-8 right-8 text-8xl opacity-20">🌾</div>
              <div className="absolute bottom-8 left-8 text-8xl opacity-20">🚜</div>
              <div className="absolute top-1/2 left-1/4 text-8xl opacity-20 transform -translate-y-1/2">💰</div>
              
              <div className="relative z-10 h-full flex flex-col justify-center">
                <div className="mb-12">
                  <h3 className="text-3xl font-bold mb-6 leading-tight">
                    Transform African Agriculture With Us
                  </h3>
                  <p className="text-green-100 text-lg leading-relaxed mb-8">
                    Join thousands of farmers, buyers, and service providers building the future of food security across our beautiful continent.
                  </p>
                </div>
                
                {/* Feature List */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                      💰
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Secure M-Pesa Payments</h4>
                      <p className="text-green-100 text-sm">Fast, reliable mobile payments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                      🗺️
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Live AgriPayAfrica Map</h4>
                      <p className="text-green-100 text-sm">Real-time agricultural insights</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                      🤝
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Thriving Community</h4>
                      <p className="text-green-100 text-sm">Connect with agricultural experts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                      📈
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Market Intelligence</h4>
                      <p className="text-green-100 text-sm">Smart pricing and trend analysis</p>
                    </div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-12 pt-8 border-t border-white/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">50K+</div>
                      <div className="text-green-100 text-sm">Farmers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">15K+</div>
                      <div className="text-green-100 text-sm">Buyers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">18</div>
                      <div className="text-green-100 text-sm">Countries</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-amber-700/80 text-sm">
            By joining AgriPay, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;