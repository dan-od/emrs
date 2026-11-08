import { useState, useEffect, useCallback } from 'react';
import accountsApi from '../services/accountsApi';
import { extractData } from './helpers';

// Accounts summary statistics.
export const useAccountsStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setStats(extractData(await accountsApi.getStats()));
    } catch (err) {
      setError(err.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// Record a payment against a work order.
export const useRecordPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recordPayment = async (id, paymentData) => {
    try {
      setLoading(true);
      setError(null);
      return extractData(await accountsApi.recordPayment(id, paymentData));
    } catch (err) {
      setError(err.message || 'Failed to record payment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { recordPayment, loading, error };
};
