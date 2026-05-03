// services/finance.service.js — Complete finance module with overview, expenses, ledger

const Finance     = require("../models/finance.model");
const Transaction = require("../models/transaction.model");
const Task        = require("../models/task.model");
const User        = require("../models/user.model");

/**
 * Create a finance record (Admin)
 */
const createRecord = async (data, userId, societyId) => {
  const record = await Finance.create({ ...data, recordedBy: userId, society: societyId });

  // Also create a Transaction for tracking
  await Transaction.create({
    society: societyId,
    recordedBy: userId,
    user: data.paidBy || null,
    type: data.type === "income" ? "credit" : "debit",
    category: data.category || "general",
    amount: data.amount,
    description: data.description,
    date: data.date || new Date(),
  });

  return record;
};

/**
 * Get all finance records with summary
 */
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

/**
 * Finance Overview — aggregated data for dashboard charts
 * Returns: Total Collections, Total Expenses, Reserve Funds, Pending Dues,
 *          monthly revenue vs expense arrays for charting
 */
const getOverview = async (societyId) => {
  // Total collections (all income) & total expenses
  const totals = await Finance.aggregate([
    { $match: { society: societyId } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalMap = {};
  totals.forEach((t) => (totalMap[t._id] = t.total));
  const totalCollections = totalMap["income"] || 0;
  const totalExpenses = totalMap["expense"] || 0;
  const reserveFunds = totalCollections - totalExpenses;

  // Pending dues — count unpaid financial tasks
  const pendingFinancialTasks = await Task.find({
    society: societyId,
    type: "financial",
    status: { $nin: ["completed", "Paid"] },
  });
  const pendingDuesAmount = pendingFinancialTasks.reduce((s, t) => s + (t.amount || 0), 0);
  const pendingDuesCount = pendingFinancialTasks.length;

  // Monthly revenue vs expense for charting (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyData = await Finance.aggregate([
    {
      $match: {
        society: societyId,
        date: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Transform into chart-friendly array
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartMap = {};

  monthlyData.forEach((entry) => {
    const key = `${entry._id.year}-${entry._id.month}`;
    if (!chartMap[key]) {
      chartMap[key] = {
        name: months[entry._id.month - 1],
        amount: 0,
        expenses: 0,
      };
    }
    if (entry._id.type === "income") chartMap[key].amount = entry.total;
    if (entry._id.type === "expense") chartMap[key].expenses = entry.total;
  });

  const collectionData = Object.values(chartMap);

  return {
    totalCollections,
    totalExpenses,
    reserveFunds,
    pendingDues: {
      amount: pendingDuesAmount,
      count: pendingDuesCount,
    },
    collectionData,
  };
};

/**
 * Expense breakdown by category
 */
const getExpenses = async (societyId) => {
  const breakdown = await Finance.aggregate([
    { $match: { society: societyId, type: "expense" } },
    {
      $group: {
        _id: "$category",
        value: { $sum: "$amount" },
      },
    },
    { $sort: { value: -1 } },
  ]);

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
  const expenseData = breakdown.map((item, i) => ({
    name: item._id || "Other",
    value: item.value,
    color: COLORS[i % COLORS.length],
  }));

  const total = expenseData.reduce((s, e) => s + e.value, 0);
  const serviceDistribution = expenseData.map((e) => ({
    name: e.name,
    percent: total > 0 ? Math.round((e.value / total) * 100) : 0,
    color: e.color,
  }));

  return { expenseData, serviceDistribution, totalExpenses: total };
};

/**
 * Individual resident ledger — transaction history + pending obligations
 */
const getLedger = async (societyId, userId) => {
  // Get all transactions for this user
  const transactions = await Transaction.find({
    society: societyId,
    $or: [{ user: userId }, { recordedBy: userId }],
  })
    .populate("user", "name unit")
    .populate("task", "title amount")
    .sort({ date: -1 });

  // Get pending financial tasks assigned to this user
  const pendingObligations = await Task.find({
    society: societyId,
    type: "financial",
    status: { $nin: ["completed", "Paid"] },
    $or: [
      { assignedTo: userId },
      { visibleTo: { $in: ["residents", "all"] } },
    ],
  }).sort({ dueDate: 1 });

  // Outstanding balance
  const credits = transactions
    .filter((t) => t.type === "credit" && t.user?.toString() === userId.toString())
    .reduce((s, t) => s + t.amount, 0);
  const obligations = pendingObligations.reduce((s, t) => s + (t.amount || 0), 0);

  return {
    transactions,
    pendingObligations,
    summary: {
      totalPaid: credits,
      totalPending: obligations,
      outstandingBalance: obligations - credits > 0 ? obligations - credits : 0,
    },
  };
};

module.exports = { createRecord, getRecords, getOverview, getExpenses, getLedger };
