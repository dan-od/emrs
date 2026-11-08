import { useApi } from '@/hooks/useApi';
import { REPORTS } from '@/services/endpoints';

// Drop empty filter values so the URL only carries active filters.
const toQuery = (filters) => {
  if (!filters) return '';
  const active = Object.entries(filters).filter(([, v]) => v);
  return active.length ? `?${new URLSearchParams(Object.fromEntries(active))}` : '';
};

// The /reports/* endpoints wrap their payload as { success, data }.
const useReport = (endpoint, filters, enabled = true) => {
  const { data, error, isLoading, refresh } = useApi(enabled ? `${endpoint}${toQuery(filters)}` : null);
  return { data: data?.data || null, error, isLoading, refresh };
};

export const useRequestAnalytics = (filters, enabled) => useReport(REPORTS.REQUEST_ANALYTICS, filters, enabled);
export const useSafetyOverview = (filters, enabled) => useReport(REPORTS.SAFETY_OVERVIEW, filters, enabled);
export const useEquipmentUtilization = (filters, enabled) => useReport(REPORTS.EQUIPMENT_UTILIZATION, filters, enabled);
export const useMaintenanceCosts = (filters, enabled) => useReport(REPORTS.MAINTENANCE_COSTS, filters, enabled);
