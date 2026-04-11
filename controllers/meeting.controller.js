// controllers/meeting.controller.js
const meetingService = require("../services/meeting.service");

// POST /api/meetings
const createMeeting = async (req, res, next) => {
  try {
    const meeting = await meetingService.createMeeting(req.body, req.user._id, req.user.society);
    res.status(201).json({ success: true, meeting });
  } catch (err) { next(err); }
};

// GET /api/meetings
const getMeetings = async (req, res, next) => {
  try {
    const meetings = await meetingService.getMeetings(req.user.society);
    res.json({ success: true, meetings });
  } catch (err) { next(err); }
};

// GET /api/meetings/:id
const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await meetingService.getMeetingById(req.params.id, req.user.society);
    res.json({ success: true, meeting });
  } catch (err) { next(err); }
};

// PATCH /api/meetings/:id
const updateMeeting = async (req, res, next) => {
  try {
    const meeting = await meetingService.updateMeeting(req.params.id, req.user.society, req.body);
    res.json({ success: true, meeting });
  } catch (err) { next(err); }
};

// GET /api/meetings/:id/join  → Agora token for audio call
const joinMeeting = async (req, res, next) => {
  try {
    const joinInfo = await meetingService.getJoinToken(req.params.id, req.user.society, req.user._id);
    res.json({ success: true, ...joinInfo });
  } catch (err) { next(err); }
};

// PATCH /api/meetings/:id/start
const startMeeting = async (req, res, next) => {
  try {
    const meeting = await meetingService.startMeeting(req.params.id, req.user.society);
    res.json({ success: true, meeting });
  } catch (err) { next(err); }
};

// PATCH /api/meetings/:id/end
const endMeeting = async (req, res, next) => {
  try {
    const meeting = await meetingService.endMeeting(req.params.id, req.user.society);
    res.json({ success: true, meeting });
  } catch (err) { next(err); }
};

// POST /api/meetings/:id/upload-audio
// Admin uploads the phone/laptop recording after the meeting ends.
// Multer puts the file buffer in req.file.buffer
// → AssemblyAI transcribes it → Claude summarizes → saved to meeting
const uploadAudio = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No audio file provided. Send file as multipart field 'audio'." });
    }
    const result = await meetingService.uploadAudioAndTranscribe(
      req.params.id,
      req.user.society,
      req.file.buffer
    );
    // 202 Accepted — processing happens in background
    res.status(202).json({ success: true, ...result });
  } catch (err) { next(err); }
};

// POST /api/meetings/:id/transcript  → manual fallback (admin pastes transcript text)
const submitTranscript = async (req, res, next) => {
  try {
    const result = await meetingService.submitTranscript(req.params.id, req.user.society, req.body.transcript);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

module.exports = {
  createMeeting, getMeetings, getMeetingById, updateMeeting,
  joinMeeting, startMeeting, endMeeting,
  uploadAudio, submitTranscript,
};
