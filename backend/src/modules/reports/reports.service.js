const { query } = require('../../config/db');
const q = require('./reports.queries');
const accountsQueries = require('../accounts/accounts.queries');

const rows = async (sql) => (await query(sql)).rows;
const one = async (sql) => (await query(sql)).rows[0];

const getRequestAnalytics = async () => ({
  totals: await one(q.requestTotals),
  byType: await rows(q.requestsByType),
  byStatus: await rows(q.requestsByStatus),
  byPriority: await rows(q.requestsByPriority)
});

const getSafetyOverview = async () => ({
  byType: await rows(q.safetyByType),
  bySeverity: await rows(q.safetyBySeverity),
  byStatus: await rows(q.safetyByStatus)
});

const getEquipmentUtilization = async () => ({
  totals: await one(q.equipmentTotals),
  byStatus: await rows(q.equipmentByStatus),
  byDepartment: await rows(q.equipmentByDepartment)
});

// Financial figures come from the accounts module's own queries so the two
// surfaces never disagree.
const getMaintenanceCosts = async () => ({
  totals: await one(accountsQueries.getCostStats),
  byDepartment: await rows(accountsQueries.getCostsByDepartment),
  byVendor: await rows(accountsQueries.getCostsByVendor),
  byServiceType: await rows(accountsQueries.getServiceTypeBreakdown)
});

module.exports = {
  getRequestAnalytics, getSafetyOverview,
  getEquipmentUtilization, getMaintenanceCosts
};
