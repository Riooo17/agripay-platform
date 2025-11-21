import { useState, useEffect, useCallback } from 'react';
import { financialAPI } from '../services/api';

export const useFinancialData = () => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [activeClients, setActiveClients] = useState([]);
  const [insurancePolicies, setInsurancePolicies] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading financial data...');
      
      // Use the single dashboard endpoint that returns all data
      const dashboardResponse = await financialAPI.getDashboardData();
      
      if (dashboardResponse.success) {
        const data = dashboardResponse.data;
        setLoanApplications(data.loanApplications || []);
        setActiveClients(data.activeClients || []);
        setInsurancePolicies(data.insurancePolicies || []);
        setDashboardStats(data.dashboardStats || {});
        console.log('✅ Financial data loaded successfully');
      } else {
        throw new Error(dashboardResponse.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('❌ Error loading financial data:', err);
      setError(err.message || 'Failed to load financial data');
      // Set empty arrays as fallback
      setLoanApplications([]);
      setActiveClients([]);
      setInsurancePolicies([]);
      setDashboardStats({});
    } finally {
      setLoading(false);
    }
  }, []);

  const approveLoan = async (applicationId) => {
    try {
      const response = await financialAPI.approveLoan(applicationId);
      
      if (response.success) {
        await loadInitialData(); // Refresh data
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error approving loan:', err);
      return { 
        success: false, 
        error: err.message || 'Failed to approve loan' 
      };
    }
  };

  const rejectLoan = async (applicationId, reason = 'Not meeting requirements') => {
    try {
      const response = await financialAPI.rejectLoan(applicationId, reason);
      
      if (response.success) {
        await loadInitialData(); // Refresh data
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error rejecting loan:', err);
      return { 
        success: false, 
        error: err.message || 'Failed to reject loan' 
      };
    }
  };

  const approveInsurance = async (policyId) => {
    try {
      const response = await financialAPI.approveInsurance(policyId);
      
      if (response.success) {
        await loadInitialData(); // Refresh data
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error approving insurance:', err);
      return { 
        success: false, 
        error: err.message || 'Failed to approve insurance' 
      };
    }
  };

  const rejectInsurance = async (policyId, reason = 'Not meeting requirements') => {
    try {
      const response = await financialAPI.rejectInsurance(policyId, reason);
      
      if (response.success) {
        await loadInitialData(); // Refresh data
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error rejecting insurance:', err);
      return { 
        success: false, 
        error: err.message || 'Failed to reject insurance' 
      };
    }
  };

  const requestPayment = async (clientId, paymentData) => {
    try {
      const response = await financialAPI.initiatePaystackPayment(paymentData);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error requesting payment:', err);
      return { 
        success: false, 
        error: err.message || 'Failed to request payment' 
      };
    }
  };

  const updateClientPayment = async (clientId, paymentData) => {
    try {
      const response = await financialAPI.updateClientPayment(clientId, paymentData);
      
      if (response.success) {
        await loadInitialData(); // Refresh data
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error updating client payment:', err);
      return { 
        success: false, 
        error: err.message || 'Failed to update payment' 
      };
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    loanApplications,
    activeClients,
    insurancePolicies,
    dashboardStats,
    loading,
    error,
    approveLoan,
    rejectLoan,
    approveInsurance,
    rejectInsurance,
    requestPayment,
    updateClientPayment,
    refreshData
  };
};
