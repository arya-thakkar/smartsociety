// services/society.service.js

const Society = require("../models/society.model");
const User = require("../models/user.model");

const MAX_ADMINS = parseInt(process.env.MAX_ADMINS) || 3;

const createSociety = async ({ name, address, amenities }, userId) => {
  const society = await Society.create({ name, address, amenities, createdBy: userId });
  await User.findByIdAndUpdate(userId, { role: "admin", society: society._id });
  return society;
};

const joinSociety = async ({ inviteCode, unit }, userId) => {
  const society = await Society.findOne({ inviteCode: inviteCode.toUpperCase() });
  if (!society) throw { status: 404, message: "Invalid invite code" };
  const user = await User.findById(userId);
  if (user.society) throw { status: 400, message: "Already a member of a society" };
  await User.findByIdAndUpdate(userId, { role: "resident", society: society._id, unit });
  return society;
};

const getSociety = async (societyId) => {
  const society = await Society.findById(societyId).populate("createdBy", "name email");
  if (!society) throw { status: 404, message: "Society not found" };
  return society;
};

const updateSociety = async (societyId, updates) => {
  const society = await Society.findByIdAndUpdate(societyId, updates, { new: true });
  if (!society) throw { status: 404, message: "Society not found" };
  return society;
};

module.exports = { createSociety, joinSociety, getSociety, updateSociety };
