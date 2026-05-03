// services/log.service.js — Gate entry/exit/scanner logging

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

/**
 * Create a gate/scanner log entry
 */
const createLog = async (data, userId, societyId) => {
  const log = await Log.create({
    ...data,
    society: societyId,
    verifiedBy: userId,
    timestamp: new Date(),
  });

  return Log.findById(log._id)
    .populate("visitor", "name vehicleNumber")
    .populate("verifiedBy", "name");
};

module.exports = { getLogs, createLog };
