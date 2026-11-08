const service = require('./reports.service');

// Accept ?department, ?dateFrom, ?dateTo on every report.
const pickFilters = (query = {}) => ({
  department: query.department || undefined,
  dateFrom: query.dateFrom || undefined,
  dateTo: query.dateTo || undefined
});

const wrap = (fn) => async (req, res, next) => {
  try {
    res.json({ success: true, data: await fn(pickFilters(req.query)) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRequestAnalytics: wrap(service.getRequestAnalytics),
  getSafetyOverview: wrap(service.getSafetyOverview),
  getEquipmentUtilization: wrap(service.getEquipmentUtilization),
  getMaintenanceCosts: wrap(service.getMaintenanceCosts)
};
