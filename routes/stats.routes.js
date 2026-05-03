// routes/stats.routes.js — Dashboard statistics
const router = require("express").Router();
const { getAdminStats, getResidentStats, getGuardStats } = require("../controllers/stats.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.get("/admin",    protect, authorize("admin"),    getAdminStats);      // GET /api/stats/admin
router.get("/resident", protect, authorize("resident"), getResidentStats);   // GET /api/stats/resident
router.get("/guard",    protect, authorize("guard"),    getGuardStats);      // GET /api/stats/guard

module.exports = router;
