import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [investorMode, setInvestorMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock user data for demonstration
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: 'Demo User',
      email: 'demo@agripay.com',
      role: 'investor',
      avatar: null
    };
    setUser(mockUser);
  }, []);

  const value = {
    user,
    setUser,
    investorMode,
    setInvestorMode,
    loading,
    setLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;