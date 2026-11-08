import { useState, useEffect, useCallback } from 'react';
import accountsApi from '../services/accountsApi';
import { extractData } from './helpers';

// Work orders list with filters.
export const useWorkOrders = (filters = {}) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = extractData(await accountsApi.getWorkOrders(filters), { workOrders: [], pagination: {} });
      if (Array.isArray(data)) {
        setWorkOrders(data);
        setPagination({});
      } else {
        setWorkOrders(data.workOrders || data.work_orders || []);
        setPagination(data.pagination || {});
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch work orders');
      setWorkOrders([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchWorkOrders(); }, [fetchWorkOrders]);

  return { workOrders, pagination, loading, error, refetch: fetchWorkOrders };
};

// Single work order by id.
export const useWorkOrder = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    (async () => {
      try {
        setLoading(true);
        setData(extractData(await accountsApi.getWorkOrderById(id)));
      } catch (err) {
        setError(err.message || 'Failed to fetch work order');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return { data, loading, error };
};
