// src/components/BackendTest.jsx
import React, { useState, useEffect } from 'react';
import { checkServerStatus, mpesaAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const BackendTest = () => {
  const [status, setStatus] = useState(null);
  const [mpesaStatus, setMpesaStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const testConnections = async () => {
      try {
        // Test server connection
        const serverResult = await checkServerStatus();
        setStatus(serverResult);

        // Test M-Pesa connection if user is logged in
        if (user) {
          const token = localStorage.getItem('agripay_token');
          const mpesaResult = await mpesaAPI.testConnection(token);
          setMpesaStatus(mpesaResult);
        }
      } catch (error) {
        setStatus({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    testConnections();
  }, [user]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-green-200">
      <h3 className="text-xl font-bold text-green-800 mb-4">🌐 Backend Connection Status</h3>
      
      {loading ? (
        <p className="text-amber-600">Testing connections...</p>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-700">Server Connection</h4>
            <pre className="text-sm mt-1 text-green-600">
              {status?.error ? `❌ ${status.error}` : '✅ Server is responding'}
            </pre>
          </div>

          {mpesaStatus && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700">M-Pesa Connection</h4>
              <pre className="text-sm mt-1 text-blue-600">
                {JSON.stringify(mpesaStatus, null, 2)}
              </pre>
            </div>
          )}

          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700">Available Endpoints</h4>
            <ul className="text-sm text-gray-600 mt-1 space-y-1">
              <li>✅ POST /api/auth/login</li>
              <li>✅ POST /api/auth/register</li>
              <li>✅ POST /api/mpesa/stk-push</li>
              <li>✅ POST /api/mpesa/validate-phone</li>
              <li>✅ GET /api/mpesa/status</li>
              <li>✅ GET /api/mpesa/test-connection</li>
              <li>✅ POST /api/mpesa/test-payment</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendTest;