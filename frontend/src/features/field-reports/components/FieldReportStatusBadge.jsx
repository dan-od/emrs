import { memo } from 'react';

const STATUS_CONFIG = {
  Submitted: { bg: 'bg-yellow-100 dark:bg-yellow-500/20', text: 'text-yellow-700 dark:text-yellow-400', label: 'Pending Review' },
  Reviewed: { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-400', label: 'Reviewed' },
  Approved: { bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-700 dark:text-green-400', label: 'Approved' },
  Rejected: { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-400', label: 'Rejected' }
};

export const FieldReportStatusBadge = memo(({ status, className = '' }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Submitted;
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${cfg.bg} ${cfg.text} ${className}`}>
      {cfg.label}
    </span>
  );
});

FieldReportStatusBadge.displayName = 'FieldReportStatusBadge';
