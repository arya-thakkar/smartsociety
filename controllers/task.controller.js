// controllers/task.controller.js
const taskService = require("../services/task.service");

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user._id, req.user.society);
    res.status(201).json({ success: true, task });
  } catch (err) { next(err); }
};

const getTasks = async (req, res, next) => {
  try {
    // Pass user role so service filters by visibility
    const tasks = await taskService.getTasks(req.user.society, req.user.role);
    res.json({ success: true, tasks });
  } catch (err) { next(err); }
};

const updateTask = async (req, res, next) => {
  try {
    // Pass userId so the task service can record who paid for financial tasks
    const task = await taskService.updateTask(req.params.id, req.user.society, req.body, req.user._id);
    res.json({ success: true, task });
  } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.society);
    res.json({ success: true, message: "Task deleted" });
  } catch (err) { next(err); }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
