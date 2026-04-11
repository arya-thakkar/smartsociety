const staffService = require("../services/staff.service");
const createStaff = async (req, res, next) => { try { const staff = await staffService.createStaff(req.body, req.user.society); res.status(201).json({ success: true, staff }); } catch (err) { next(err); } };
const getStaff = async (req, res, next) => { try { const staff = await staffService.getStaff(req.user.society); res.json({ success: true, staff }); } catch (err) { next(err); } };
const getStaffById = async (req, res, next) => { try { const staff = await staffService.getStaffById(req.params.id, req.user.society); res.json({ success: true, staff }); } catch (err) { next(err); } };
const updateStaff = async (req, res, next) => { try { const staff = await staffService.updateStaff(req.params.id, req.user.society, req.body); res.json({ success: true, staff }); } catch (err) { next(err); } };
const deleteStaff = async (req, res, next) => { try { const staff = await staffService.deleteStaff(req.params.id, req.user.society); res.json({ success: true, message: "Staff deactivated", staff }); } catch (err) { next(err); } };
module.exports = { createStaff, getStaff, getStaffById, updateStaff, deleteStaff };
