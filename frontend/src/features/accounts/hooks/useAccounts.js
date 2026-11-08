/**
 * Accounts hooks — barrel.
 *
 * Implementations are split by concern to stay within the hook size limit:
 *   useWorkOrders.js    — work order list + detail
 *   useAccountsStats.js — stats + record payment
 *   useAccountsCosts.js — cost breakdowns (department / vendor / service)
 */
export { useWorkOrders, useWorkOrder } from './useWorkOrders';
export { useAccountsStats, useRecordPayment } from './useAccountsStats';
export { useCostsByDepartment, useCostsByVendor, useServiceBreakdown } from './useAccountsCosts';
