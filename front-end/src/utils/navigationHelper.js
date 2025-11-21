// Navigation helper to ensure users go to correct dashboards
export const getDashboardPath = (userRole) => {
  switch (userRole) {
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

export const redirectToCorrectDashboard = (userRole, navigate) => {
  const correctPath = getDashboardPath(userRole);
  navigate(correctPath, { replace: true });
};

export const isCorrectDashboard = (userRole, currentPath) => {
  const expectedPath = getDashboardPath(userRole);
  return currentPath.startsWith(expectedPath);
};
