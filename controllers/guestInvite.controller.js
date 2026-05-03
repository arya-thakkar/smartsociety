// controllers/guestInvite.controller.js — Pre-approved guest invites

const guestInviteService = require("../services/guestInvite.service");

const createInvite = async (req, res, next) => {
  try {
    const invite = await guestInviteService.createInvite(
      req.body, req.user._id, req.user.society, req.user.name, req.user.unit
    );
    res.status(201).json({ success: true, invite });
  } catch (err) { next(err); }
};

const getInvites = async (req, res, next) => {
  try {
    const invites = await guestInviteService.getInvites(req.user.society, req.user._id, req.user.role);
    res.json({ success: true, invites });
  } catch (err) { next(err); }
};

const deleteInvite = async (req, res, next) => {
  try {
    await guestInviteService.deleteInvite(req.params.id, req.user._id, req.user.role, req.user.society);
    res.json({ success: true, message: "Invite cancelled" });
  } catch (err) { next(err); }
};

const verifyInvite = async (req, res, next) => {
  try {
    const invite = await guestInviteService.verifyInvite(req.body.qrCode, req.user.society);
    res.json({ success: true, invite });
  } catch (err) { next(err); }
};

module.exports = { createInvite, getInvites, deleteInvite, verifyInvite };
