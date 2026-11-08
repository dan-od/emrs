/**
 * Accounts Dashboard Page (Asset Ledger)
 * Work order costs and payment recording for the accounts department.
 */

import { useState, useCallback } from 'react';
import { PageWrapper } from '@/components/layout';
import { BookOpen, RefreshCw } from 'lucide-react';

import { CostSummaryStats, CostFilters, RecordPaymentModal, WorkOrderList } from '../components';
import { useWorkOrders, useAccountsStats, useRecordPayment, useWorkOrderExport } from '../hooks';
import { useUiStore } from '@/store/uiStore';

const AccountsDashboard = () => {
  const [filters, setFilters] = useState({
    dateFrom: '', dateTo: '', department: '', paymentStatus: '', minCost: '', maxCost: ''
  });
  const [page, setPage] = useState(1);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const { addNotification } = useUiStore();

  const { workOrders, pagination, loading, error, refetch } = useWorkOrders({ ...filters, page });
  const { stats, loading: statsLoading } = useAccountsStats();
  const { recordPayment, loading: paymentLoading } = useRecordPayment();
  const { exporting, handleExport } = useWorkOrderExport(filters);

  const safeWorkOrders = Array.isArray(workOrders) ? workOrders : [];

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleRecordPayment = async (paymentData) => {
    try {
      await recordPayment(selectedWorkOrder.id, paymentData);
      setSelectedWorkOrder(null);
      addNotification({ type: 'success', message: 'Payment recorded.' });
      refetch();
    } catch {
      addNotification({ type: 'error', message: 'Failed to record payment.' });
    }
  };

  return (
    <PageWrapper
      title="Asset Ledger"
      subtitle="Track work order costs and record payments"
      icon={BookOpen}
      actions={
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      }
    >
      <CostSummaryStats stats={stats} loading={statsLoading} />

      <CostFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        exporting={exporting}
      />

      <WorkOrderList
        workOrders={safeWorkOrders}
        loading={loading}
        error={error}
        pagination={pagination}
        page={page}
        onPageChange={setPage}
        onRecordPayment={setSelectedWorkOrder}
        onRetry={refetch}
      />

      {selectedWorkOrder && (
        <RecordPaymentModal
          workOrder={selectedWorkOrder}
          onClose={() => setSelectedWorkOrder(null)}
          onSubmit={handleRecordPayment}
          loading={paymentLoading}
        />
      )}
    </PageWrapper>
  );
};

export default AccountsDashboard;
