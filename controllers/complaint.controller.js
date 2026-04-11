// controllers/complaint.controller.js
const complaintService = require("../services/complaint.service");

const generateComplaint = async (req, res, next) => {
  try {
    const fields = await complaintService.generateComplaintFields(req.body.text);
    res.json({ success: true, ...fields });
  } catch (err) { next(err); }
};

// req.files is populated by multer upload.array("images", 5)
const createComplaint = async (req, res, next) => {
  try {
    const imageFiles = req.files || [];
    const complaint = await complaintService.createComplaint(
      req.body, req.user._id, req.user.society, imageFiles
    );
    res.status(201).json({ success: true, complaint });
  } catch (err) { next(err); }
};

const getComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintService.getComplaints(
      req.user.society, req.user._id, req.user.role
    );
    res.json({ success: true, complaints });
  } catch (err) { next(err); }
};

const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.updateComplaint(
      req.params.id, req.user.society, req.body
    );
    res.json({ success: true, complaint });
  } catch (err) { next(err); }
};

module.exports = { generateComplaint, createComplaint, getComplaints, updateComplaint };
