// controllers/finance.controller.js — Complete finance module

const financeService = require("../services/finance.service");

const createRecord = async (req, res, next) => {
  try {
    const record = await financeService.createRecord(req.body, req.user._id, req.user.society);
    res.status(201).json({ success: true, record });
  } catch (err) { next(err); }
};

const getRecords = async (req, res, next) => {
  try {
    const data = await financeService.getRecords(req.user.society, req.query);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

// GET /api/finance/overview — Aggregate KPIs for Finance dashboard
const getOverview = async (req, res, next) => {
  try {
    const overview = await financeService.getOverview(req.user.society);
    res.json({ success: true, ...overview });
  } catch (err) { next(err); }
};

// GET /api/finance/expenses — Expense breakdown by category
const getExpenses = async (req, res, next) => {
  try {
    const data = await financeService.getExpenses(req.user.society);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

// GET /api/finance/ledger — Individual resident transaction history
const getLedger = async (req, res, next) => {
  try {
    const data = await financeService.getLedger(req.user.society, req.user._id);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

module.exports = { createRecord, getRecords, getOverview, getExpenses, getLedger };
