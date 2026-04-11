// services/complaint.service.js

const Complaint = require("../models/complaint.model");
const aiService = require("./ai.service");
const { uploadImage } = require("./cloudinary.service");

const generateComplaintFields = async (text) => {
  return aiService.generateComplaint(text);
};

/**
 * Create complaint — images is an array of multer file buffers
 */
const createComplaint = async (data, userId, societyId, imageFiles = []) => {
  // Upload proof images to Cloudinary
  const images = [];
  for (const file of imageFiles) {
    const result = await uploadImage(file.buffer, "complaints");
    images.push({ url: result.url, publicId: result.publicId });
  }
  return Complaint.create({ ...data, raisedBy: userId, society: societyId, images });
};

const getComplaints = async (societyId, userId, role) => {
  const filter = { society: societyId };
  if (role === "resident") filter.raisedBy = userId;
  return Complaint.find(filter)
    .populate("raisedBy", "name unit")
    .sort({ createdAt: -1 });
};

const updateComplaint = async (id, societyId, updates) => {
  if (updates.status === "resolved") updates.resolvedAt = new Date();
  const complaint = await Complaint.findOneAndUpdate(
    { _id: id, society: societyId },
    updates,
    { new: true }
  );
  if (!complaint) throw { status: 404, message: "Complaint not found" };
  return complaint;
};

module.exports = { generateComplaintFields, createComplaint, getComplaints, updateComplaint };
