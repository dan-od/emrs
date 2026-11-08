import { useState, useEffect } from 'react';
import accountsApi from '../services/accountsApi';
import { extractData } from './helpers';

// Shared fetcher for the cost-breakdown endpoints, which all return an array.
const useCostResource = (apiFn) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const extracted = extractData(await apiFn(), []);
        setData(Array.isArray(extracted) ? extracted : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
};

export const useCostsByDepartment = () => useCostResource(accountsApi.getCostsByDepartment);
export const useCostsByVendor = () => useCostResource(accountsApi.getCostsByVendor);
export const useServiceBreakdown = () => useCostResource(accountsApi.getServiceBreakdown);
