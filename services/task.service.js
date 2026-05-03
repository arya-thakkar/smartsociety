// services/task.service.js

const Task = require("../models/task.model");
const Transaction = require("../models/transaction.model");
const aiService = require("./ai.service");

const createTask = async (data, userId, societyId) => {
  const priority = await aiService.prioritizeTask({ title: data.title, description: data.description });
  // visibleTo defaults to "all" if not provided; admin picks "residents", "guards", or "all"
  return Task.create({ ...data, priority, createdBy: userId, society: societyId });
};

const getTasks = async (societyId, userRole) => {
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };

  // Build visibility filter based on role
  let visibilityFilter;
  if (userRole === "guard") {
    // Guards see tasks for guards or all — NOT resident-only tasks
    visibilityFilter = { visibleTo: { $in: ["guards", "all"] } };
  } else if (userRole === "resident") {
    // Residents see tasks for residents or all — NOT guard-only tasks
    visibilityFilter = { visibleTo: { $in: ["residents", "all"] } };
  } else {
    // Admin sees everything
    visibilityFilter = {};
  }

  const tasks = await Task.find({ society: societyId, ...visibilityFilter })
    .populate("createdBy", "name")
    .populate("assignedTo", "name role");

  return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};

const updateTask = async (id, societyId, updates, userId = null) => {
  if (updates.status === "completed") updates.completedAt = new Date();

  const task = await Task.findOneAndUpdate(
    { _id: id, society: societyId },
    updates,
    { new: true }
  );
  if (!task) throw { status: 404, message: "Task not found" };

  // If a financial task is marked as "Paid", generate a credit Transaction
  if (task.type === "financial" && updates.status === "Paid" && task.amount > 0) {
    await Transaction.create({
      society: societyId,
      user: userId || task.assignedTo,
      task: task._id,
      type: "credit",
      category: "maintenance",
      amount: task.amount,
      description: `Payment for: ${task.title}`,
      date: new Date(),
    });
  }

  return task;
};

const deleteTask = async (id, societyId) => {
  const task = await Task.findOneAndDelete({ _id: id, society: societyId });
  if (!task) throw { status: 404, message: "Task not found" };
  return task;
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
