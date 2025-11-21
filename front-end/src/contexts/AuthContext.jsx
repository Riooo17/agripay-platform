import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("agripay_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem("agripay_token");
    return !!token; // only show loading if token exists
  });

  const [authChecked, setAuthChecked] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("agripay_token");
      console.log('🔄 AuthContext: Starting token verification');
      console.log('   - Token exists:', !!token);
      console.log('   - User in localStorage:', !!localStorage.getItem("agripay_user"));

      if (!token) {
        console.log('❌ AuthContext: No token found, skipping verification');
        setLoading(false);
        setAuthChecked(true);
        return;
      }

      try {
        console.log('📡 AuthContext: Calling getProfile API...');
        const result = await authAPI.getProfile();

        console.log('✅ AuthContext: API Response:', result);

        // Handle different response formats
        if ((result.success && result.user) || (result.data && result.data.user)) {
          const userData = result.user || result.data.user;
          console.log('🎉 AuthContext: Token valid, user authenticated');
          console.log('   - User role:', userData.role);
          console.log('   - User name:', userData.name);
          
          setUser(userData);
          localStorage.setItem("agripay_user", JSON.stringify(userData));
        } else {
          console.log('❌ AuthContext: Token invalid or API error');
          console.log('   - Success:', result.success);
          console.log('   - User data:', result.user);
          localStorage.removeItem("agripay_token");
          localStorage.removeItem("agripay_user");
          setUser(null);
        }
      } catch (err) {
        console.error('💥 AuthContext: Token verification failed:', err);
        console.log('⚠️ AuthContext: Keeping user logged in despite error (offline mode)');
        // Don't logout on network errors - keep user logged in for better UX
        // The interceptor will handle unauthorized errors
      }

      setLoading(false);
      setAuthChecked(true);
      console.log('✅ AuthContext: Authentication check completed');
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 AuthContext: Starting login...');
      const result = await authAPI.login(email, password);

      console.log('✅ AuthContext: Login API Response:', result);

      // Handle different response formats
      if ((result.token && result.user) || (result.data && result.data.token)) {
        const token = result.token || result.data.token;
        const userData = result.user || result.data.user;
        
        console.log('🎉 AuthContext: Login successful');
        console.log('   - User role:', userData.role);
        console.log('   - User name:', userData.name);
        
        localStorage.setItem("agripay_token", token);
        localStorage.setItem("agripay_user", JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }

      console.log('❌ AuthContext: Login failed - no token or user');
      return { 
        success: false, 
        error: result.message || result.data?.message || "Login failed" 
      };
    } catch (error) {
      console.error('💥 AuthContext: Login error:', error);
      return { 
        success: false, 
        error: error.message || "Network error occurred. Please try again." 
      };
    }
  };

  const register = async (data) => {
    try {
      console.log('📝 AuthContext: Starting registration...');
      console.log('   - Registration data:', { ...data, password: '***' }); // Hide password in logs
      
      const result = await authAPI.register(data);

      console.log('✅ AuthContext: Register API Response:', result);

      // Handle different response formats
      if ((result.token && result.user) || (result.data && result.data.token)) {
        const token = result.token || result.data.token;
        const userData = result.user || result.data.user;
        
        console.log('🎉 AuthContext: Registration successful');
        console.log('   - User role:', userData.role);
        console.log('   - User name:', userData.name);
        
        localStorage.setItem("agripay_token", token);
        localStorage.setItem("agripay_user", JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }

      console.log('❌ AuthContext: Registration failed - no token or user');
      return { 
        success: false, 
        error: result.message || result.data?.message || "Registration failed" 
      };
    } catch (error) {
      console.error('💥 AuthContext: Registration error:', error);
      return { 
        success: false, 
        error: error.message || "Network error occurred. Please try again." 
      };
    }
  };

  const logout = async () => {
    console.log('🚪 AuthContext: Logging out...');
    try {
      // Try to call logout API, but don't wait for it
      await authAPI.logout().catch(err => {
        console.log('⚠️ AuthContext: Logout API call failed, but continuing with local logout');
      });
    } finally {
      // Always clear local storage
      localStorage.removeItem("agripay_token");
      localStorage.removeItem("agripay_user");
      setUser(null);
      console.log('✅ AuthContext: Logout completed');
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Get user's dashboard path based on role
  const getDashboardPath = () => {
    if (!user) return '/auth';
    
    switch (user.role) {
      case 'farmer':
        return '/farmer-dashboard';
      case 'buyer':
        return '/buyer-dashboard';
      case 'input_seller':
        return '/input-seller-dashboard';
      case 'expert':
        return '/expert-dashboard';
      case 'logistics':
        return '/logistics-dashboard';
      case 'financial':
        return '/financial-dashboard';
      default:
        return '/auth';
    }
  };

  const value = {
    user,
    loading,
    authChecked,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
    getDashboardPath
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};