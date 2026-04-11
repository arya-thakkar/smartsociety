const financeService = require("../services/finance.service");
const createRecord = async (req, res, next) => { try { const record = await financeService.createRecord(req.body, req.user._id, req.user.society); res.status(201).json({ success: true, record }); } catch (err) { next(err); } };
const getRecords = async (req, res, next) => { try { const data = await financeService.getRecords(req.user.society, req.query); res.json({ success: true, ...data }); } catch (err) { next(err); } };
module.exports = { createRecord, getRecords };
