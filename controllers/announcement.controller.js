const announcementService = require("../services/announcement.service");
const createAnnouncement = async (req, res, next) => { try { const ann = await announcementService.createAnnouncement(req.body, req.user._id, req.user.society); res.status(201).json({ success: true, announcement: ann }); } catch (err) { next(err); } };
const getAnnouncements = async (req, res, next) => { try { const announcements = await announcementService.getAnnouncements(req.user.society); res.json({ success: true, announcements }); } catch (err) { next(err); } };
const deleteAnnouncement = async (req, res, next) => { try { await announcementService.deleteAnnouncement(req.params.id, req.user.society); res.json({ success: true, message: "Deleted" }); } catch (err) { next(err); } };
module.exports = { createAnnouncement, getAnnouncements, deleteAnnouncement };
