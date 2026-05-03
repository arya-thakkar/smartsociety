// controllers/stats.controller.js — Dashboard statistics endpoints

const statsService = require("../services/stats.service");

const getAdminStats = async (req, res, next) => {
  try {
    const stats = await statsService.getAdminStats(req.user.society);
    res.json({ success: true, ...stats });
  } catch (err) { next(err); }
};

const getResidentStats = async (req, res, next) => {
  try {
    const stats = await statsService.getResidentStats(req.user.society, req.user._id);
    res.json({ success: true, ...stats });
  } catch (err) { next(err); }
};

const getGuardStats = async (req, res, next) => {
  try {
    const stats = await statsService.getGuardStats(req.user.society);
    res.json({ success: true, ...stats });
  } catch (err) { next(err); }
};

module.exports = { getAdminStats, getResidentStats, getGuardStats };
