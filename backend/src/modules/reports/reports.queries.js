/**
 * Reports / Analytics aggregate queries.
 *
 * Every query is a builder: it takes a pre-built filter clause so the service
 * can apply ?department / ?dateFrom / ?dateTo uniformly.
 *   - requests / safety / equipment: `where` is a full `WHERE ...` (or '').
 *   - cost queries already carry a base WHERE, so they take `and` (`AND ...` or '').
 *
 * Column qualifiers matter: requests and safety LEFT JOIN users for the
 * department filter, so status/type columns are table-qualified to stay
 * unambiguous. Cost queries are replicated here (not imported from accounts)
 * because they need the users join added for department filtering.
 */

// ── Requests (FROM requests r LEFT JOIN users ru ON r.requester_id = ru.id) ──
const REQ_FROM = `FROM requests r LEFT JOIN users ru ON r.requester_id = ru.id`;
const requestTotals = (where) => `
  SELECT
    COUNT(*)::int AS total,
    COUNT(*) FILTER (WHERE r.status = 'Pending')::int AS pending,
    COUNT(*) FILTER (WHERE r.status = 'Approved')::int AS approved,
    COUNT(*) FILTER (WHERE r.status = 'Manager_Approved')::int AS manager_approved,
    COUNT(*) FILTER (WHERE r.status = 'Disbursed')::int AS disbursed,
    COUNT(*) FILTER (WHERE r.status = 'Rejected')::int AS rejected,
    COUNT(*) FILTER (WHERE r.status = 'Completed')::int AS completed
  ${REQ_FROM} ${where}
`;
const requestsByType = (where) => `
  SELECT r.type::text AS label, COUNT(*)::int AS value ${REQ_FROM} ${where}
  GROUP BY r.type ORDER BY value DESC`;
const requestsByStatus = (where) => `
  SELECT r.status::text AS label, COUNT(*)::int AS value ${REQ_FROM} ${where}
  GROUP BY r.status ORDER BY value DESC`;
const requestsByPriority = (where) => `
  SELECT COALESCE(r.priority::text, 'Unset') AS label, COUNT(*)::int AS value ${REQ_FROM} ${where}
  GROUP BY r.priority ORDER BY value DESC`;

// ── Safety (FROM safety_reports sr LEFT JOIN users u ON sr.reporter_id = u.id) ──
const SAF_FROM = `FROM safety_reports sr LEFT JOIN users u ON sr.reporter_id = u.id`;
const safetyByType = (where) => `
  SELECT sr.type::text AS label, COUNT(*)::int AS value ${SAF_FROM} ${where}
  GROUP BY sr.type ORDER BY value DESC`;
const safetyBySeverity = (where) => `
  SELECT sr.severity::text AS label, COUNT(*)::int AS value ${SAF_FROM} ${where}
  GROUP BY sr.severity ORDER BY value DESC`;
const safetyByStatus = (where) => `
  SELECT sr.status::text AS label, COUNT(*)::int AS value ${SAF_FROM} ${where}
  GROUP BY sr.status ORDER BY value DESC`;

// ── Equipment (FROM equipment e) ──
const equipmentTotals = (where) => `
  SELECT
    COUNT(*)::int AS total,
    COUNT(*) FILTER (WHERE e.asset_category = 'EQUIPMENT')::int AS equipment,
    COUNT(*) FILTER (WHERE e.asset_category = 'TOOL')::int AS tool,
    COUNT(*) FILTER (WHERE e.status = 'Available')::int AS available,
    COUNT(*) FILTER (WHERE e.status = 'In_Use')::int AS in_use,
    COUNT(*) FILTER (WHERE e.status = 'Maintenance')::int AS maintenance,
    COUNT(*) FILTER (WHERE e.status = 'Out_of_Service')::int AS out_of_service,
    COALESCE(SUM(COALESCE(e.current_hours, 0)), 0)::float AS total_hours
  FROM equipment e ${where}`;
const equipmentByStatus = (where) => `
  SELECT e.status::text AS label, COUNT(*)::int AS value FROM equipment e ${where}
  GROUP BY e.status ORDER BY value DESC`;
const equipmentByDepartment = (where) => `
  SELECT COALESCE(e.owning_department, 'Shared') AS label, COUNT(*)::int AS value
  FROM equipment e ${where} GROUP BY e.owning_department ORDER BY value DESC`;

// ── Maintenance costs (replicated from accounts with users join for dept filter) ──
const COST_FROM = `
  FROM maintenance_schedule m
  LEFT JOIN requests r ON m.request_id = r.id
  LEFT JOIN users u ON r.requester_id = u.id`;
const COST_BASE = `WHERE (
    r.manager_cost_estimate IS NOT NULL OR r.purchasing_final_cost IS NOT NULL
    OR m.actual_cost IS NOT NULL OR m.status = 'Completed'
  )`;
const COST_EXPR = `COALESCE(m.actual_cost, r.purchasing_final_cost, r.manager_cost_estimate)`;

const costStats = (and) => `
  SELECT
    COUNT(*) as total_work_orders,
    COUNT(*) FILTER (WHERE m.accounts_final_payment IS NOT NULL) as paid_count,
    COUNT(*) FILTER (WHERE m.accounts_final_payment IS NULL) as unpaid_count,
    COUNT(*) FILTER (WHERE m.status = 'Completed') as completed_count,
    COUNT(*) FILTER (WHERE m.status IN ('In_Progress', 'Scheduled')) as in_progress_count,
    COALESCE(SUM(r.manager_cost_estimate), 0) as total_estimated,
    COALESCE(SUM(r.purchasing_final_cost), 0) as total_confirmed,
    COALESCE(SUM(m.actual_cost), 0) as total_actual_cost,
    COALESCE(SUM(m.accounts_final_payment), 0) as total_paid,
    COALESCE(SUM(${COST_EXPR}) FILTER (WHERE m.created_at >= DATE_TRUNC('month', CURRENT_DATE)), 0) as this_month_cost,
    COALESCE(SUM(${COST_EXPR}) FILTER (WHERE m.created_at >= DATE_TRUNC('quarter', CURRENT_DATE)), 0) as this_quarter_cost,
    COALESCE(SUM(${COST_EXPR}) FILTER (WHERE m.created_at >= DATE_TRUNC('year', CURRENT_DATE)), 0) as this_year_cost
  ${COST_FROM} ${COST_BASE} ${and}`;

const costsByDepartment = (and) => `
  SELECT COALESCE(u.department::text, 'Unassigned') as department,
    COUNT(*) as work_order_count,
    COALESCE(SUM(${COST_EXPR}), 0) as total_cost,
    COALESCE(SUM(m.accounts_final_payment), 0) as total_paid,
    COALESCE(AVG(${COST_EXPR}), 0) as avg_cost
  ${COST_FROM} ${COST_BASE} ${and}
  GROUP BY u.department ORDER BY total_cost DESC`;

const costsByVendor = (and) => `
  SELECT COALESCE(v.name, 'In-House') as vendor_name,
    COUNT(*) as work_order_count,
    COALESCE(SUM(${COST_EXPR}), 0) as total_cost,
    COALESCE(SUM(m.accounts_final_payment), 0) as total_paid
  ${COST_FROM}
  LEFT JOIN vendors v ON (r.details->>'vendorRecommendation')::uuid = v.id
  ${COST_BASE} ${and}
  GROUP BY v.name ORDER BY total_cost DESC`;

const serviceBreakdown = (and) => `
  SELECT COALESCE(r.details->>'serviceType', 'In-House') as service_type,
    COUNT(*) as work_order_count,
    COALESCE(SUM(${COST_EXPR}), 0) as total_cost
  ${COST_FROM} ${COST_BASE} ${and}
  GROUP BY r.details->>'serviceType'`;

module.exports = {
  requestTotals, requestsByType, requestsByStatus, requestsByPriority,
  safetyByType, safetyBySeverity, safetyByStatus,
  equipmentTotals, equipmentByStatus, equipmentByDepartment,
  costStats, costsByDepartment, costsByVendor, serviceBreakdown
};
