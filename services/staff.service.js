// services/staff.service.js

const Staff = require("../models/staff.model");

const createStaff = async (data, societyId) => {
  return Staff.create({ ...data, society: societyId });
};

const getStaff = async (societyId) => {
  return Staff.find({ society: societyId, active: true }).sort({ name: 1 });
};

const getStaffById = async (staffId, societyId) => {
  const staff = await Staff.findOne({ _id: staffId, society: societyId });
  if (!staff) throw { status: 404, message: "Staff not found" };
  return staff;
};

const updateStaff = async (staffId, societyId, updates) => {
  const staff = await Staff.findOneAndUpdate(
    { _id: staffId, society: societyId },
    updates,
    { new: true }
  );
  if (!staff) throw { status: 404, message: "Staff not found" };
  return staff;
};

const deleteStaff = async (staffId, societyId) => {
  const staff = await Staff.findOneAndUpdate(
    { _id: staffId, society: societyId },
    { active: false },
    { new: true }
  );
  if (!staff) throw { status: 404, message: "Staff not found" };
  return staff;
};

module.exports = { createStaff, getStaff, getStaffById, updateStaff, deleteStaff };
