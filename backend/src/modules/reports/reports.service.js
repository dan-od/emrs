const { query } = require('../../config/db');
const q = require('./reports.queries');

/**
 * Build filter conditions + positional params for a dataset.
 * `cols` maps the logical filters to this dataset's actual columns.
 * Returns { where, and, params } — `where` for a fresh WHERE, `and` to append
 * to a query that already has one. An empty filter yields empty clauses.
 */
const buildFilter = (filters = {}, cols) => {
  const { department, dateFrom, dateTo } = filters;
  const conds = [];
  const params = [];
  if (department && cols.dept) { params.push(department); conds.push(`${cols.dept} = $${params.length}`); }
  if (dateFrom && cols.date) { params.push(dateFrom); conds.push(`${cols.date} >= $${params.length}`); }
  if (dateTo && cols.date) { params.push(dateTo); conds.push(`${cols.date} <= $${params.length}`); }
  const joined = conds.join(' AND ');
  return {
    where: conds.length ? `WHERE ${joined}` : '',
    and: conds.length ? `AND ${joined}` : '',
    params
  };
};

const rows = async (sqlFn, clause, params) => (await query(sqlFn(clause), params)).rows;
const one = async (sqlFn, clause, params) => (await query(sqlFn(clause), params)).rows[0];

const getRequestAnalytics = async (filters) => {
  const { where, params } = buildFilter(filters, { date: 'r.created_at', dept: 'ru.department' });
  return {
    totals: await one(q.requestTotals, where, params),
    byType: await rows(q.requestsByType, where, params),
    byStatus: await rows(q.requestsByStatus, where, params),
    byPriority: await rows(q.requestsByPriority, where, params)
  };
};

const getSafetyOverview = async (filters) => {
  const { where, params } = buildFilter(filters, { date: 'sr.created_at', dept: 'u.department' });
  return {
    byType: await rows(q.safetyByType, where, params),
    bySeverity: await rows(q.safetyBySeverity, where, params),
    byStatus: await rows(q.safetyByStatus, where, params)
  };
};

const getEquipmentUtilization = async (filters) => {
  const { where, params } = buildFilter(filters, { date: 'e.created_at', dept: 'e.owning_department' });
  return {
    totals: await one(q.equipmentTotals, where, params),
    byStatus: await rows(q.equipmentByStatus, where, params),
    byDepartment: await rows(q.equipmentByDepartment, where, params)
  };
};

const getMaintenanceCosts = async (filters) => {
  const { and, params } = buildFilter(filters, { date: 'm.created_at', dept: 'u.department' });
  return {
    totals: await one(q.costStats, and, params),
    byDepartment: await rows(q.costsByDepartment, and, params),
    byVendor: await rows(q.costsByVendor, and, params),
    byServiceType: await rows(q.serviceBreakdown, and, params)
  };
};

module.exports = {
  getRequestAnalytics, getSafetyOverview,
  getEquipmentUtilization, getMaintenanceCosts
};
