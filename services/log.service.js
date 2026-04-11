// services/log.service.js

const Log = require("../models/log.model");

const getLogs = async (societyId, filters = {}) => {
  const query = { society: societyId };
  if (filters.action) query.action = filters.action;
  if (filters.from)   query.timestamp = { $gte: new Date(filters.from) };
  if (filters.to)     query.timestamp = { ...query.timestamp, $lte: new Date(filters.to) };

  return Log.find(query)
    .populate("visitor", "name vehicleNumber")
    .populate("verifiedBy", "name")
    .sort({ timestamp: -1 })
    .limit(200);
};

module.exports = { getLogs };
