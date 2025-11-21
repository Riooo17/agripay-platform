import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Blog from './pages/Blog'
import FarmerDashboard from './pages/FarmerDashboard'
import BuyerDashboard from './pages/BuyerDashboard'
import LogisticsDashboard from './pages/LogisticsDashboard'
import InputSellerDashboard from './pages/seller/Dashboard'
import ExpertDashboard from './pages/ExpertDashboard'
import FinancialDashboard from './pages/FinancialDashboard'

// Test backend connection
const testBackendConnection = async () => {
  console.log('🔌 Testing backend connection...');
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('✅ Backend is running:', data);
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    console.log('💡 Make sure your backend is running on http://localhost:5000');
    return false;
  }
};

// STRICT Protected Route component - FIXED VERSION
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, authChecked } = useAuth();
  
  // Show loading while checking auth
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-800 font-semibold">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // If no user, redirect to auth
  if (!user) {
    console.log('🚫 ProtectedRoute: No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }
  
  // STRICT ROLE CHECK - NO MORE ROLE MIXING
  if (requiredRole && user.role !== requiredRole) {
    console.log(`🚫 ROLE VIOLATION: User role ${user.role} trying to access ${requiredRole} dashboard`);
    
    // Redirect to correct dashboard based on actual role
    let correctPath = '/auth';
    switch (user.role) {
      case 'farmer': correctPath = '/farmer-dashboard'; break;
      case 'buyer': correctPath = '/buyer-dashboard'; break;
      case 'input_seller': correctPath = '/input-seller-dashboard'; break;
      case 'expert': correctPath = '/expert-dashboard'; break;
      case 'logistics': correctPath = '/logistics-dashboard'; break;
      case 'financial': correctPath = '/financial-dashboard'; break;
      default: correctPath = '/auth';
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wrong Dashboard</h1>
          <p className="text-gray-600 mb-4">
            You are a <strong>{user.role}</strong> but trying to access the <strong>{requiredRole}</strong> dashboard.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = correctPath}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Go to Your {user.role} Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/auth'}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  console.log(`✅ Access granted: ${user.role} accessing ${requiredRole} dashboard`);
  return children;
};

// Dashboard redirect based on user role
const DashboardRedirect = () => {
  const { user, loading, authChecked } = useAuth();
  
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-800 font-semibold">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    console.log('DashboardRedirect: No user, going to /auth');
    return <Navigate to="/auth" replace />;
  }
  
  console.log(`DashboardRedirect: User role ${user.role}, redirecting...`);
  
  switch (user.role) {
    case 'farmer':
      return <Navigate to="/farmer-dashboard" replace />;
    case 'buyer':
      return <Navigate to="/buyer-dashboard" replace />;
    case 'input_seller':
      return <Navigate to="/input-seller-dashboard" replace />;
    case 'expert':
      return <Navigate to="/expert-dashboard" replace />;
    case 'logistics':
      return <Navigate to="/logistics-dashboard" replace />;
    case 'financial':
      return <Navigate to="/financial-dashboard" replace />;
    default:
      console.log('DashboardRedirect: Unknown role, going to /auth');
      return <Navigate to="/auth" replace />;
  }
};

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-green-800 font-semibold">Loading AgriPay Africa...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    testBackendConnection();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <React.Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/blog" element={<Blog />} />
                
                {/* Dashboard Redirect */}
                <Route path="/dashboard" element={<DashboardRedirect />} />
                
                {/* STRICTLY PROTECTED Dashboard Routes - NO ROLE MIXING */}
                <Route 
                  path="/farmer-dashboard/*" 
                  element={
                    <ProtectedRoute requiredRole="farmer">
                      <FarmerDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/buyer-dashboard/*" 
                  element={
                    <ProtectedRoute requiredRole="buyer">
                      <BuyerDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/logistics-dashboard/*" 
                  element={
                    <ProtectedRoute requiredRole="logistics">
                      <LogisticsDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/input-seller-dashboard/*" 
                  element={
                    <ProtectedRoute requiredRole="input_seller">
                      <InputSellerDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/expert-dashboard/*" 
                  element={
                    <ProtectedRoute requiredRole="expert">
                      <ExpertDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/financial-dashboard/*" 
                  element={
                    <ProtectedRoute requiredRole="financial">
                      <FinancialDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App