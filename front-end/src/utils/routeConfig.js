// Centralized route configuration
export const routeConfig = {
  // Public routes (no auth required)
  public: [
    '/',
    '/auth',
    '/about',
    '/contact'
  ],
  
  // Role-based route access
  roleRoutes: {
    // Farmer routes
    farmer: [
      '/farmer/*',
      '/farmer-dashboard',
      '/farmer/products',
      '/farmer/orders'
    ],
    
    // Buyer routes  
    buyer: [
      '/buyer/*',
      '/buyer-dashboard',
      '/buyer/products',
      '/buyer/orders'
    ],
    
    // Input Seller routes
    input_seller: [
      '/seller/*',
      '/input-seller-dashboard',
      '/seller/dashboard',
      '/seller/products',
      '/seller/orders'
    ],
    
    // Expert routes
    expert: [
      '/expert/*',
      '/expert-dashboard',
      '/expert/consultations'
    ],
    
    // Logistics routes
    logistics: [
      '/logistics/*',
      '/logistics-dashboard',
      '/logistics/shipments'
    ],
    
    // Financial routes
    financial: [
      '/financial/*',
      '/financial-dashboard',
      '/financial/loans'
    ]
  },
  
  // Get required roles for a specific path
  getRequiredRoles: (pathname) => {
    const roles = [];
    
    Object.entries(routeConfig.roleRoutes).forEach(([role, routes]) => {
      if (routes.some(route => {
        // Exact match or wildcard match
        if (route.endsWith('/*')) {
          const baseRoute = route.replace('/*', '');
          return pathname.startsWith(baseRoute);
        }
        return pathname === route;
      })) {
        roles.push(role);
      }
    });
    
    return roles.length > 0 ? roles : null;
  },
  
  // Check if user can access path
  canAccess: (user, pathname) => {
    // Public routes are accessible to all
    if (routeConfig.public.includes(pathname)) {
      return true;
    }
    
    // If no user, cannot access protected routes
    if (!user) {
      return false;
    }
    
    const requiredRoles = routeConfig.getRequiredRoles(pathname);
    
    // If no specific roles required, allow access to authenticated users
    if (!requiredRoles) {
      return true;
    }
    
    // Check if user has one of the required roles
    return requiredRoles.includes(user.role);
  }
};

// Default redirect paths for each role
export const getDefaultDashboard = (role) => {
  const dashboards = {
    farmer: '/farmer-dashboard',
    buyer: '/buyer-dashboard', 
    input_seller: '/seller/dashboard',
    expert: '/expert-dashboard',
    logistics: '/logistics-dashboard',
    financial: '/financial-dashboard'
  };
  
  return dashboards[role] || '/auth';
};