// services/member.service.js

const User = require("../models/user.model");
const { uploadImage, deleteImage } = require("./cloudinary.service");

const MAX_ADMINS = parseInt(process.env.MAX_ADMINS) || 3;

const getMembers = async (societyId) => {
  return User.find({ society: societyId }).select("-password").sort({ role: 1, name: 1 });
};

const getMember = async (memberId, societyId) => {
  const member = await User.findOne({ _id: memberId, society: societyId }).select("-password");
  if (!member) throw { status: 404, message: "Member not found" };
  return member;
};

const changeRole = async (memberId, newRole, societyId) => {
  const allowed = ["admin", "resident", "guard"];
  if (!allowed.includes(newRole)) throw { status: 400, message: "Invalid role" };
  if (newRole === "admin") {
    const adminCount = await User.countDocuments({ society: societyId, role: "admin" });
    if (adminCount >= MAX_ADMINS) throw { status: 400, message: `Max ${MAX_ADMINS} admins allowed per society` };
  }
  const member = await User.findOneAndUpdate(
    { _id: memberId, society: societyId }, { role: newRole }, { new: true }
  ).select("-password");
  if (!member) throw { status: 404, message: "Member not found" };
  return member;
};

const removeMember = async (memberId, societyId) => {
  const member = await User.findOneAndUpdate(
    { _id: memberId, society: societyId },
    { role: "pending", society: null, unit: null },
    { new: true }
  ).select("-password");
  if (!member) throw { status: 404, message: "Member not found" };
  return member;
};

// ── Family members ────────────────────────────────────────────────

const addFamilyMember = async (userId, memberData, photoFile = null) => {
  let photo = null, photoPublicId = null;
  if (photoFile) {
    const result = await uploadImage(photoFile.buffer, "family-members");
    photo = result.url;
    photoPublicId = result.publicId;
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { familyMembers: { ...memberData, photo, photoPublicId } } },
    { new: true }
  ).select("-password");
  return user.familyMembers;
};

const removeFamilyMember = async (userId, familyMemberId) => {
  const user = await User.findById(userId);
  const fm = user.familyMembers.id(familyMemberId);
  if (!fm) throw { status: 404, message: "Family member not found" };
  if (fm.photoPublicId) await deleteImage(fm.photoPublicId);
  await User.findByIdAndUpdate(userId, { $pull: { familyMembers: { _id: familyMemberId } } });
  return { message: "Family member removed" };
};

// ── Household staff (maids, drivers, etc.) ────────────────────────

const addHouseholdStaff = async (userId, staffData, photoFile = null) => {
  let photo = null, photoPublicId = null;
  if (photoFile) {
    const result = await uploadImage(photoFile.buffer, "household-staff");
    photo = result.url;
    photoPublicId = result.publicId;
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { householdStaff: { ...staffData, photo, photoPublicId } } },
    { new: true }
  ).select("-password");
  return user.householdStaff;
};

const removeHouseholdStaff = async (userId, staffId) => {
  const user = await User.findById(userId);
  const staff = user.householdStaff.id(staffId);
  if (!staff) throw { status: 404, message: "Staff member not found" };
  if (staff.photoPublicId) await deleteImage(staff.photoPublicId);
  await User.findByIdAndUpdate(userId, { $pull: { householdStaff: { _id: staffId } } });
  return { message: "Staff member removed" };
};

module.exports = { getMembers, getMember, changeRole, removeMember, addFamilyMember, removeFamilyMember, addHouseholdStaff, removeHouseholdStaff };
