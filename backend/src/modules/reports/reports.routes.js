/**
 * Reports / Analytics routes — read-only roll-ups for management.
 */
const express = require('express');
const router = express.Router();
const controller = require('./reports.controller');
const { authenticate, requireRoles } = require('../../middleware');

// Management + admin roles. Reporting cuts across departments, so it is not
// tied to the per-department gating the source endpoints use.
const REPORT_ROLES = [
  'Super_Admin', 'Admin', 'IT_Manager',
  'Operations_Manager', 'Maintenance_Manager', 'Purchasing_Manager',
  'Accounts_Manager', 'Safety_Manager', 'Workshop_Manager',
  'Logistics_Manager', 'HR_Manager'
];

router.use(authenticate);
router.use(requireRoles(REPORT_ROLES));

router.get('/request-analytics', controller.getRequestAnalytics);
router.get('/safety-overview', controller.getSafetyOverview);
router.get('/equipment-utilization', controller.getEquipmentUtilization);
router.get('/maintenance-costs', controller.getMaintenanceCosts);

module.exports = router;
