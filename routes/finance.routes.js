const router = require("express").Router();
const { createRecord, getRecords } = require("../controllers/finance.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/",  protect, authorize("admin"), createRecord);             // POST /api/finance
router.get("/",   protect, authorize("admin"), getRecords);               // GET  /api/finance

module.exports = router;
