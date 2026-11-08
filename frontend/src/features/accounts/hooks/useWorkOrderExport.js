import { useState } from 'react';
import accountsApi from '../services/accountsApi';
import { useUiStore } from '@/store/uiStore';

// Exports the current work-order view as a downloaded CSV.
export const useWorkOrderExport = (filters) => {
  const [exporting, setExporting] = useState(false);
  const { addNotification } = useUiStore();

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await accountsApi.exportWorkOrders(filters);
      const data = response?.data || response;
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `asset-ledger-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      addNotification({ type: 'error', message: 'Export failed. Please try again.' });
    } finally {
      setExporting(false);
    }
  };

  return { exporting, handleExport };
};
