// controllers/log.controller.js — Gate entry/exit logging

const logService = require("../services/log.service");

const getLogs = async (req, res, next) => {
  try {
    const logs = await logService.getLogs(req.user.society, req.query);
    res.json({ success: true, logs });
  } catch (err) { next(err); }
};

const createLog = async (req, res, next) => {
  try {
    const log = await logService.createLog(req.body, req.user._id, req.user.society);
    res.status(201).json({ success: true, log });
  } catch (err) { next(err); }
};

module.exports = { getLogs, createLog };
