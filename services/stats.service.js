// services/stats.service.js — Dashboard statistics with MongoDB aggregations

const User        = require("../models/user.model");
const Complaint   = require("../models/complaint.model");
const Visitor     = require("../models/visitor.model");
const Task        = require("../models/task.model");
const Finance     = require("../models/finance.model");
const Transaction = require("../models/transaction.model");
const Log         = require("../models/log.model");
const Booking     = require("../models/booking.model");
const Announcement = require("../models/announcement.model");
const Meeting     = require("../models/meeting.model");

/**
 * Admin Dashboard KPIs
 */
const getAdminStats = async (societyId) => {
  const [
    totalResidents,
    guardCount,
    pendingCount,
    openComplaints,
    inProgressComplaints,
    totalTasks,
    pendingTasks,
    activeMeetings,
    pendingBookings,
    todayVisitors,
    monthlyCollectionResult,
  ] = await Promise.all([
    User.countDocuments({ society: societyId, role: "resident" }),
    User.countDocuments({ society: societyId, role: "guard" }),
    User.countDocuments({ society: societyId, role: "pending" }),
    Complaint.countDocuments({ society: societyId, status: "open" }),
    Complaint.countDocuments({ society: societyId, status: "in-progress" }),
    Task.countDocuments({ society: societyId }),
    Task.countDocuments({ society: societyId, status: "pending" }),
    Meeting.countDocuments({ society: societyId, status: { $in: ["scheduled", "live"] } }),
    Booking.countDocuments({ society: societyId, status: "pending" }),
    Visitor.countDocuments({
      society: societyId,
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
    // Monthly collection from Finance records
    Finance.aggregate([
      {
        $match: {
          society: societyId,
          type: "income",
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const monthlyRaw = monthlyCollectionResult[0]?.total || 0;
  const monthlyCollection =
    monthlyRaw >= 100000
      ? `₹${(monthlyRaw / 100000).toFixed(1)}L`
      : `₹${monthlyRaw.toLocaleString("en-IN")}`;

  return {
    totalResidents,
    guardCount,
    pendingCount,
    openComplaints,
    inProgressComplaints,
    totalTasks,
    pendingTasks,
    activeMeetings,
    pendingBookings,
    todayVisitors,
    monthlyCollection,
  };
};

/**
 * Resident Dashboard KPIs
 */
const getResidentStats = async (societyId, userId) => {
  const [
    myComplaints,
    myOpenComplaints,
    myTasks,
    myPendingTasks,
    myBookings,
    myVisitors,
    announcements,
    societyBalance,
  ] = await Promise.all([
    Complaint.countDocuments({ society: societyId, raisedBy: userId }),
    Complaint.countDocuments({ society: societyId, raisedBy: userId, status: { $in: ["open", "in-progress"] } }),
    Task.countDocuments({ society: societyId, $or: [{ assignedTo: userId }, { visibleTo: { $in: ["residents", "all"] } }] }),
    Task.countDocuments({ society: societyId, status: "pending", visibleTo: { $in: ["residents", "all"] } }),
    Booking.countDocuments({ society: societyId, bookedBy: userId }),
    Visitor.countDocuments({ society: societyId, addedBy: userId }),
    Announcement.countDocuments({ society: societyId }),
    // Society balance = income - expenses
    Finance.aggregate([
      { $match: { society: societyId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  // Calculate society balance
  const balanceMap = {};
  societyBalance.forEach((b) => (balanceMap[b._id] = b.total));
  const balance = (balanceMap["income"] || 0) - (balanceMap["expense"] || 0);
  const balanceFormatted =
    balance >= 100000
      ? `₹${(balance / 100000).toFixed(1)}L`
      : `₹${balance.toLocaleString("en-IN")}`;

  return {
    myComplaints,
    myOpenComplaints,
    myTasks,
    myPendingTasks,
    myBookings,
    myVisitors,
    announcements,
    societyBalance: balanceFormatted,
  };
};

/**
 * Guard Dashboard KPIs
 */
const getGuardStats = async (societyId) => {
  const today = new Date(new Date().setHours(0, 0, 0, 0));

  const [
    entriesToday,
    exitToday,
    deniedToday,
    currentlyInside,
    pendingVisitors,
    activeTasks,
    guardTasks,
  ] = await Promise.all([
    Log.countDocuments({ society: societyId, action: "entry", timestamp: { $gte: today } }),
    Log.countDocuments({ society: societyId, action: "exit", timestamp: { $gte: today } }),
    Log.countDocuments({ society: societyId, action: "denied", timestamp: { $gte: today } }),
    Visitor.countDocuments({ society: societyId, status: "approved", exitTime: null }),
    Visitor.countDocuments({ society: societyId, status: "pending" }),
    Task.countDocuments({ society: societyId, status: { $ne: "completed" }, visibleTo: { $in: ["guards", "all"] } }),
    Task.countDocuments({ society: societyId, visibleTo: { $in: ["guards", "all"] } }),
  ]);

  return {
    entriesToday,
    exitToday,
    deniedToday,
    currentlyInside,
    pendingVisitors,
    activeTasks,
    guardTasks,
  };
};

module.exports = { getAdminStats, getResidentStats, getGuardStats };
