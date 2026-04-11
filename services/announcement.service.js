// services/announcement.service.js

const Announcement = require("../models/announcement.model");

const createAnnouncement = async (data, userId, societyId) => {
  return Announcement.create({ ...data, createdBy: userId, society: societyId });
};

const getAnnouncements = async (societyId) => {
  return Announcement.find({ society: societyId })
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });
};

const deleteAnnouncement = async (id, societyId) => {
  const ann = await Announcement.findOneAndDelete({ _id: id, society: societyId });
  if (!ann) throw { status: 404, message: "Announcement not found" };
  return ann;
};

module.exports = { createAnnouncement, getAnnouncements, deleteAnnouncement };
