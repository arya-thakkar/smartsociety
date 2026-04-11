// services/finance.service.js

const Finance = require("../models/finance.model");

const createRecord = async (data, userId, societyId) => {
  return Finance.create({ ...data, recordedBy: userId, society: societyId });
};

const getRecords = async (societyId, filters = {}) => {
  const query = { society: societyId };
  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;

  const records = await Finance.find(query)
    .populate("recordedBy", "name")
    .populate("paidBy", "name unit")
    .sort({ date: -1 });

  // Compute balance summary
  const income  = records.filter(r => r.type === "income").reduce((s, r) => s + r.amount, 0);
  const expense = records.filter(r => r.type === "expense").reduce((s, r) => s + r.amount, 0);

  return { records, summary: { income, expense, balance: income - expense } };
};

module.exports = { createRecord, getRecords };
