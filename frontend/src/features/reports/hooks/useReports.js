import { useApi } from '@/hooks/useApi';
import { REPORTS } from '@/services/endpoints';

// The /reports/* endpoints wrap their payload as { success, data }.
const useReport = (endpoint, enabled = true) => {
  const { data, error, isLoading, refresh } = useApi(enabled ? endpoint : null);
  return { data: data?.data || null, error, isLoading, refresh };
};

export const useRequestAnalytics = (enabled) => useReport(REPORTS.REQUEST_ANALYTICS, enabled);
export const useSafetyOverview = (enabled) => useReport(REPORTS.SAFETY_OVERVIEW, enabled);
export const useEquipmentUtilization = (enabled) => useReport(REPORTS.EQUIPMENT_UTILIZATION, enabled);
export const useMaintenanceCosts = (enabled) => useReport(REPORTS.MAINTENANCE_COSTS, enabled);
