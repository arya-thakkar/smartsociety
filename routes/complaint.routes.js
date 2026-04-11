const router = require("express").Router();
const { generateComplaint, createComplaint, getComplaints, updateComplaint } = require("../controllers/complaint.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");

router.post("/generate", protect, generateComplaint);                                           // POST  /api/complaints/generate (AI via Gemini)
router.post("/",         protect, authorize("resident","admin"), upload.array("images", 5), createComplaint);  // POST  /api/complaints  (multipart/form-data, up to 5 proof images)
router.get("/",          protect, getComplaints);                                               // GET   /api/complaints
router.patch("/:id",     protect, authorize("admin"), updateComplaint);                         // PATCH /api/complaints/:id

module.exports = router;
