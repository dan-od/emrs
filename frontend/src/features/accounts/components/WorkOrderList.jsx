import { EmptyState } from '@/components/feedback';
import { BookOpen } from 'lucide-react';
import WorkOrderCostCard from './WorkOrderCostCard';

const Skeletons = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-24 mb-2" />
        <div className="h-6 bg-gray-200 dark:bg-dark-border rounded w-48 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-full" />
      </div>
    ))}
  </div>
);

const Pagination = ({ page, pagination, onPageChange }) => (
  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-dark-border">
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Showing {((page - 1) * 20) + 1} - {Math.min(page * 20, pagination.total)} of {pagination.total}
    </p>
    <div className="flex gap-2">
      <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}
        className="px-3 py-1 text-sm border border-gray-300 dark:border-dark-border rounded-lg disabled:opacity-50 text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-card">
        Previous
      </button>
      <button onClick={() => onPageChange(Math.min(pagination.totalPages, page + 1))} disabled={page === pagination.totalPages}
        className="px-3 py-1 text-sm border border-gray-300 dark:border-dark-border rounded-lg disabled:opacity-50 text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-card">
        Next
      </button>
    </div>
  </div>
);

export const WorkOrderList = ({ workOrders, loading, error, pagination, page, onPageChange, onRecordPayment, onRetry }) => {
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button onClick={onRetry} className="mt-2 text-sm text-red-600 dark:text-red-400 underline">Try again</button>
      </div>
    );
  }
  if (loading && workOrders.length === 0) return <Skeletons />;
  if (workOrders.length === 0) {
    return (
      <EmptyState icon={BookOpen} title="No work orders found"
        description="There are no work orders matching your filters. Try adjusting your search criteria." />
    );
  }
  return (
    <>
      <div className="space-y-4">
        {workOrders.map((wo) => (
          <WorkOrderCostCard key={wo.id} workOrder={wo} onRecordPayment={onRecordPayment} />
        ))}
      </div>
      {pagination?.totalPages > 1 && <Pagination page={page} pagination={pagination} onPageChange={onPageChange} />}
    </>
  );
};
