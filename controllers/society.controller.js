const societyService = require("../services/society.service");
const createSociety = async (req, res, next) => { try { const s = await societyService.createSociety(req.body, req.user._id); res.status(201).json({ success: true, society: s }); } catch (err) { next(err); } };
const joinSociety = async (req, res, next) => { try { const s = await societyService.joinSociety(req.body, req.user._id); res.json({ success: true, society: s }); } catch (err) { next(err); } };
const getSociety = async (req, res, next) => { try { const s = await societyService.getSociety(req.user.society); res.json({ success: true, society: s }); } catch (err) { next(err); } };
const updateSociety = async (req, res, next) => { try { const s = await societyService.updateSociety(req.user.society, req.body); res.json({ success: true, society: s }); } catch (err) { next(err); } };
module.exports = { createSociety, joinSociety, getSociety, updateSociety };
