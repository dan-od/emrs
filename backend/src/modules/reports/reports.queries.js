/**
 * Reports / Analytics aggregate queries.
 *
 * Read-only roll-ups over existing tables. Maintenance-cost figures are not
 * here — the reports service reuses the accounts module's cost queries so
 * there is a single source of truth for financial numbers.
 */

// ── Requests ──────────────────────────────────────────────────────────────
const requestTotals = `
  SELECT
    COUNT(*)::int AS total,
    COUNT(*) FILTER (WHERE status = 'Pending')::int AS pending,
    COUNT(*) FILTER (WHERE status = 'Approved')::int AS approved,
    COUNT(*) FILTER (WHERE status = 'Manager_Approved')::int AS manager_approved,
    COUNT(*) FILTER (WHERE status = 'Disbursed')::int AS disbursed,
    COUNT(*) FILTER (WHERE status = 'Rejected')::int AS rejected,
    COUNT(*) FILTER (WHERE status = 'Completed')::int AS completed
  FROM requests
`;
const requestsByType = `
  SELECT type::text AS label, COUNT(*)::int AS value
  FROM requests GROUP BY type ORDER BY value DESC
`;
const requestsByStatus = `
  SELECT status::text AS label, COUNT(*)::int AS value
  FROM requests GROUP BY status ORDER BY value DESC
`;
const requestsByPriority = `
  SELECT COALESCE(priority::text, 'Unset') AS label, COUNT(*)::int AS value
  FROM requests GROUP BY priority ORDER BY value DESC
`;

// ── Safety ────────────────────────────────────────────────────────────────
const safetyByType = `
  SELECT type::text AS label, COUNT(*)::int AS value
  FROM safety_reports GROUP BY type ORDER BY value DESC
`;
const safetyBySeverity = `
  SELECT severity::text AS label, COUNT(*)::int AS value
  FROM safety_reports GROUP BY severity ORDER BY value DESC
`;
const safetyByStatus = `
  SELECT status::text AS label, COUNT(*)::int AS value
  FROM safety_reports GROUP BY status ORDER BY value DESC
`;

// ── Equipment ─────────────────────────────────────────────────────────────
const equipmentTotals = `
  SELECT
    COUNT(*)::int AS total,
    COUNT(*) FILTER (WHERE asset_category = 'EQUIPMENT')::int AS equipment,
    COUNT(*) FILTER (WHERE asset_category = 'TOOL')::int AS tool,
    COUNT(*) FILTER (WHERE status = 'Available')::int AS available,
    COUNT(*) FILTER (WHERE status = 'In_Use')::int AS in_use,
    COUNT(*) FILTER (WHERE status = 'Maintenance')::int AS maintenance,
    COUNT(*) FILTER (WHERE status = 'Out_of_Service')::int AS out_of_service,
    COALESCE(SUM(COALESCE(current_hours, 0)), 0)::float AS total_hours
  FROM equipment
`;
const equipmentByStatus = `
  SELECT status::text AS label, COUNT(*)::int AS value
  FROM equipment GROUP BY status ORDER BY value DESC
`;
const equipmentByDepartment = `
  SELECT COALESCE(owning_department, 'Shared') AS label, COUNT(*)::int AS value
  FROM equipment GROUP BY owning_department ORDER BY value DESC
`;

module.exports = {
  requestTotals, requestsByType, requestsByStatus, requestsByPriority,
  safetyByType, safetyBySeverity, safetyByStatus,
  equipmentTotals, equipmentByStatus, equipmentByDepartment
};
