// routes/log.routes.js — Gate/scanner activity logs
const router = require("express").Router();
const { getLogs, createLog } = require("../controllers/log.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.get("/",  protect, authorize("admin","guard"), getLogs);      // GET  /api/logs
router.post("/", protect, authorize("admin","guard"), createLog);    // POST /api/logs

module.exports = router;
