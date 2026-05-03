// controllers/visitor.controller.js — Visitor management with checkout

const visitorService = require("../services/visitor.service");

const addVisitor = async (req, res, next) => {
  try {
    const visitor = await visitorService.addVisitor(req.body, req.user._id, req.user.society);
    res.status(201).json({ success: true, visitor });
  } catch (err) { next(err); }
};

const verifyVisitor = async (req, res, next) => {
  try {
    const result = await visitorService.verifyVisitor(req.body, req.user._id, req.user.society);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getVisitors = async (req, res, next) => {
  try {
    const visitors = await visitorService.getVisitors(req.user.society, req.user._id, req.user.role);
    res.json({ success: true, visitors });
  } catch (err) { next(err); }
};

// PATCH /api/visitors/:id/checkout — Mark visitor exit
const checkoutVisitor = async (req, res, next) => {
  try {
    const visitor = await visitorService.checkoutVisitor(req.params.id, req.user.society, req.user._id);
    res.json({ success: true, visitor });
  } catch (err) { next(err); }
};

module.exports = { addVisitor, verifyVisitor, getVisitors, checkoutVisitor };
