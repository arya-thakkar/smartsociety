const router = require("express").Router();
const { getLogs } = require("../controllers/log.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.get("/", protect, authorize("admin","guard"), getLogs);  // GET /api/logs

module.exports = router;
