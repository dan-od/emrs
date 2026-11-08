const service = require('./reports.service');

const wrap = (fn) => async (req, res, next) => {
  try {
    res.json({ success: true, data: await fn() });
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
