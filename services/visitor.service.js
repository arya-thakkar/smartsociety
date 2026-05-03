// services/visitor.service.js — Visitor management with checkout

const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const Visitor = require("../models/visitor.model");
const Log = require("../models/log.model");

const QR_EXPIRY_MINUTES = parseInt(process.env.QR_EXPIRY_MINUTES) || 60;

/**
 * Resident registers a visitor — generates QR token
 */
const addVisitor = async ({ name, vehicleNumber }, userId, societyId) => {
  const qrToken = uuidv4();
  const expiresAt = new Date(Date.now() + QR_EXPIRY_MINUTES * 60 * 1000);

  // Generate QR image (base64 data URL)
  const qrImageUrl = await QRCode.toDataURL(qrToken);

  const visitor = await Visitor.create({
    society: societyId,
    addedBy: userId,
    name,
    vehicleNumber,
    qrToken,
    qrImageUrl,
    expiresAt,
    status: "pending",
  });

  return visitor;
};

/**
 * Guard scans QR — verifies and logs entry
 */
const verifyVisitor = async ({ qrToken }, guardId, societyId) => {
  const visitor = await Visitor.findOne({ qrToken, society: societyId });

  if (!visitor) throw { status: 404, message: "Invalid QR token" };
  if (visitor.status === "expired" || new Date() > visitor.expiresAt) {
    await Visitor.findByIdAndUpdate(visitor._id, { status: "expired" });
    throw { status: 400, message: "QR token has expired" };
  }
  if (visitor.status === "denied") throw { status: 400, message: "Visitor access denied" };

  // Mark entry time
  await Visitor.findByIdAndUpdate(visitor._id, { status: "approved", entryTime: new Date() });

  // Create gate log
  const log = await Log.create({
    society: societyId,
    visitor: visitor._id,
    verifiedBy: guardId,
    action: "entry",
    note: `Visitor ${visitor.name} entered`,
  });

  return { visitor, log };
};

/**
 * Mark a visitor's exit — PATCH /api/visitors/:id/checkout
 */
const checkoutVisitor = async (visitorId, societyId, guardId) => {
  const visitor = await Visitor.findOneAndUpdate(
    { _id: visitorId, society: societyId, exitTime: null },
    { exitTime: new Date() },
    { new: true }
  );

  if (!visitor) throw { status: 404, message: "Visitor not found or already checked out" };

  // Create exit log
  await Log.create({
    society: societyId,
    visitor: visitor._id,
    verifiedBy: guardId || null,
    action: "exit",
    note: `Visitor ${visitor.name} exited`,
  });

  return visitor;
};

const getVisitors = async (societyId, userId, role) => {
  const filter = { society: societyId };
  // Residents only see their own visitors
  if (role === "resident") filter.addedBy = userId;
  return Visitor.find(filter).populate("addedBy", "name unit").sort({ createdAt: -1 });
};

module.exports = { addVisitor, verifyVisitor, checkoutVisitor, getVisitors };
