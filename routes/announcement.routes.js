const router = require("express").Router();
const { createAnnouncement, getAnnouncements, deleteAnnouncement } = require("../controllers/announcement.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/",      protect, authorize("admin"), createAnnouncement);   // POST   /api/announcements
router.get("/",       protect, getAnnouncements);                          // GET    /api/announcements
router.delete("/:id", protect, authorize("admin"), deleteAnnouncement);    // DELETE /api/announcements/:id

module.exports = router;
