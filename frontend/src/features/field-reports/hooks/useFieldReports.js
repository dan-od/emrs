import { useState, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { useApi } from '@/hooks/useApi';
import { FIELD_REPORTS } from '@/services/endpoints';
import { fieldReportsService } from '../services/fieldReportsService';

// GET /field-reports returns { data, pagination }
export const useFieldReports = (params) => {
  const shouldFetch = params !== null;
  const qs = params && Object.keys(params).length ? `?${new URLSearchParams(params)}` : '';
  const { data, error, isLoading, refresh } = useApi(
    shouldFetch ? `${FIELD_REPORTS.BASE}${qs}` : null
  );
  return { reports: data?.data || [], pagination: data?.pagination, error, isLoading, refresh };
};

export const useMyFieldReports = () => {
  const { data, error, isLoading, refresh } = useApi(FIELD_REPORTS.MY);
  return { reports: data?.data || [], error, isLoading, refresh };
};

export const useFieldReport = (id) => {
  const { data, error, isLoading, refresh } = useApi(id ? FIELD_REPORTS.BY_ID(id) : null);
  return { report: data, error, isLoading, refresh };
};

export const useFieldReportStats = (shouldFetch = true) => {
  const { data, error, isLoading } = useApi(shouldFetch ? FIELD_REPORTS.STATS : null);
  return { stats: data || {}, error, isLoading };
};

export const useFieldReportActions = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);

  const revalidate = () => mutate(
    key => typeof key === 'string' && key.includes('/field-reports'),
    undefined,
    { revalidate: true }
  );

  const run = useCallback(async (fn) => {
    setIsLoading(true);
    try { const r = await fn(); revalidate(); return r; }
    finally { setIsLoading(false); }
  }, []);

  return {
    isLoading,
    createReport: (data) => run(() => fieldReportsService.create(data)),
    reviewReport: (id, data) => run(() => fieldReportsService.review(id, data)),
    approveReport: (id, comments) => run(() => fieldReportsService.approve(id, comments)),
    rejectReport: (id, reason) => run(() => fieldReportsService.reject(id, reason))
  };
};
