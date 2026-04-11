// controllers/member.controller.js
const memberService = require("../services/member.service");

const getMembers    = async (req, res, next) => { try { const members = await memberService.getMembers(req.user.society); res.json({ success: true, members }); } catch (err) { next(err); } };
const getMember     = async (req, res, next) => { try { const member = await memberService.getMember(req.params.id, req.user.society); res.json({ success: true, member }); } catch (err) { next(err); } };
const changeRole    = async (req, res, next) => { try { const member = await memberService.changeRole(req.params.id, req.body.role, req.user.society); res.json({ success: true, member }); } catch (err) { next(err); } };
const removeMember  = async (req, res, next) => { try { const member = await memberService.removeMember(req.params.id, req.user.society); res.json({ success: true, message: "Member removed", member }); } catch (err) { next(err); } };

// Family
const addFamilyMember    = async (req, res, next) => { try { const result = await memberService.addFamilyMember(req.user._id, req.body, req.file); res.status(201).json({ success: true, familyMembers: result }); } catch (err) { next(err); } };
const removeFamilyMember = async (req, res, next) => { try { const result = await memberService.removeFamilyMember(req.user._id, req.params.memberId); res.json({ success: true, ...result }); } catch (err) { next(err); } };

// Household staff
const addHouseholdStaff    = async (req, res, next) => { try { const result = await memberService.addHouseholdStaff(req.user._id, req.body, req.file); res.status(201).json({ success: true, householdStaff: result }); } catch (err) { next(err); } };
const removeHouseholdStaff = async (req, res, next) => { try { const result = await memberService.removeHouseholdStaff(req.user._id, req.params.staffId); res.json({ success: true, ...result }); } catch (err) { next(err); } };

module.exports = { getMembers, getMember, changeRole, removeMember, addFamilyMember, removeFamilyMember, addHouseholdStaff, removeHouseholdStaff };
