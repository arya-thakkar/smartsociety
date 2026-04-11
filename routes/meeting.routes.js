// routes/meeting.routes.js
const router = require("express").Router();
const {
  createMeeting, getMeetings, getMeetingById, updateMeeting,
  joinMeeting, startMeeting, endMeeting,
  uploadAudio, submitTranscript,
} = require("../controllers/meeting.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { uploadAudio: uploadAudioMiddleware } = require("../middleware/upload.middleware");

router.post("/",                  protect, authorize("admin"), createMeeting);                                 // Schedule meeting
router.get("/",                   protect, getMeetings);                                                       // List all meetings
router.get("/:id",                protect, getMeetingById);                                                    // Get single (poll here for aiStatus)
router.patch("/:id",              protect, authorize("admin"), updateMeeting);                                 // Edit details
router.get("/:id/join",           protect, joinMeeting);                                                       // Get Agora token → join call
router.patch("/:id/start",        protect, authorize("admin"), startMeeting);                                  // Start meeting
router.patch("/:id/end",          protect, authorize("admin"), endMeeting);                                    // End meeting
router.post("/:id/upload-audio",  protect, authorize("admin"), uploadAudioMiddleware.single("audio"), uploadAudio);  // Upload recording → auto transcribe
router.post("/:id/transcript",    protect, authorize("admin"), submitTranscript);                              // Manual transcript fallback

module.exports = router;
