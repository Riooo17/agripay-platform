import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';

const RequireAuth = ({ children, roles = [] }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user.role)) {
    console.log(`🚫 ROLE ACCESS DENIED: User role ${user.role} cannot access route requiring roles:`, roles);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Your Role:</strong> {user.role}
            </p>
            <p className="text-sm text-yellow-800 mt-1">
              <strong>Required Roles:</strong> {roles.join(', ')}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireAuth;