import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('miniInvestmentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage when updated
  useEffect(() => {
    if (user) {
      localStorage.setItem('miniInvestmentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('miniInvestmentUser');
    }
  }, [user]);

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createUser(userData);
      if (response.success) {
        setUser(response.data);
        return response;
      } else {
        setError(response.message);
        return response;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.login(email);
      if (response.success) {
        setUser(response.data);
        return response;
      } else {
        setError(response.message);
        return response;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await apiService.getUser(user.id);
      if (response.success) {
        setUser(response.data);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    } finally {
      setLoading(false);
    }
  };

  const initiateKyc = async () => {
    if (!user?.id) return { success: false, message: 'No user logged in' };
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.initiateKyc(user.id);
      if (response.success || response.data?.status) {
        await refreshUser();
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const retryKyc = async () => {
    if (!user?.id) return { success: false, message: 'No user logged in' };
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.retryKyc(user.id);
      if (response.success || response.data?.status) {
        await refreshUser();
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const initiateAccreditation = async () => {
    if (!user?.id) return { success: false, message: 'No user logged in' };
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.initiateAccreditation(user.id);
      if (response.success || response.data?.status) {
        await refreshUser();
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const retryAccreditation = async () => {
    if (!user?.id) return { success: false, message: 'No user logged in' };
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.retryAccreditation(user.id);
      if (response.success || response.data?.status) {
        await refreshUser();
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const linkBankAccount = async (bankData) => {
    if (!user?.id) return { success: false, message: 'No user logged in' };
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.linkBankAccount({
        userId: user.id,
        ...bankData
      });
      if (response.success) {
        await refreshUser();
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unlinkBankAccount = async () => {
    if (!user?.id) return { success: false, message: 'No user logged in' };
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.unlinkBankAccount(user.id);
      if (response.success) {
        await refreshUser();
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const makeInvestment = async (amount, description) => {
    if (!user?.id) return { success: false, message: 'No user logged in' };
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.makeInvestment({
        userId: user.id,
        amount: parseFloat(amount),
        description
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getInvestments = async () => {
    if (!user?.id) return { success: false, message: 'No user logged in' };
    try {
      return await apiService.getInvestments(user.id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getBalance = async () => {
    if (!user?.id) return null;
    try {
      return await apiService.getBalance(user.id);
    } catch (err) {
      console.error('Failed to get balance:', err);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('miniInvestmentUser');
  };

  const getAuditLogs = async () => {
    if (!user?.id) return null;
    try {
      return await apiService.getAuditLogs(user.id);
    } catch (err) {
      console.error('Failed to get audit logs:', err);
      return null;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    setError,
    signup,
    login,
    refreshUser,
    initiateKyc,
    retryKyc,
    initiateAccreditation,
    retryAccreditation,
    linkBankAccount,
    unlinkBankAccount,
    makeInvestment,
    getInvestments,
    getBalance,
    getAuditLogs,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;