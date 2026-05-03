// services/guestInvite.service.js — Pre-approved guest invite management

const { v4: uuidv4 } = require("uuid");
const GuestInvite = require("../models/guestInvite.model");

/**
 * Create a pre-approved guest invite (Resident)
 */
const createInvite = async (data, userId, societyId, residentName, flat) => {
  const qrCode = `GUEST-${uuidv4().split("-")[0].toUpperCase()}-${flat || "UNIT"}`;

  const invite = await GuestInvite.create({
    ...data,
    society: societyId,
    createdBy: userId,
    resident: residentName,
    flat: flat || data.flat,
    qrCode,
  });

  return invite;
};

/**
 * Get all invites — residents see their own, admin/guard sees all
 */
const getInvites = async (societyId, userId, role) => {
  const filter = { society: societyId };
  if (role === "resident") filter.createdBy = userId;
  return GuestInvite.find(filter)
    .populate("createdBy", "name unit")
    .sort({ createdAt: -1 });
};

/**
 * Cancel/delete an invite (only owner or admin)
 */
const deleteInvite = async (inviteId, userId, role, societyId) => {
  const filter = { _id: inviteId, society: societyId };
  // Residents can only delete their own
  if (role === "resident") filter.createdBy = userId;

  const invite = await GuestInvite.findOneAndDelete(filter);
  if (!invite) throw { status: 404, message: "Invite not found or unauthorized" };
  return invite;
};

/**
 * Verify an invite by QR code (Guard scans at gate)
 */
const verifyInvite = async (qrCode, societyId) => {
  const invite = await GuestInvite.findOne({ qrCode, society: societyId });
  if (!invite) throw { status: 404, message: "Invalid invite code" };
  if (invite.status !== "Pre-Approved") {
    throw { status: 400, message: `Invite already ${invite.status.toLowerCase()}` };
  }

  invite.status = "Used";
  invite.usedAt = new Date();
  await invite.save();
  return invite;
};

module.exports = { createInvite, getInvites, deleteInvite, verifyInvite };
