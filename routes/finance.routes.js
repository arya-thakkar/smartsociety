// routes/finance.routes.js — Complete finance routes
const router = require("express").Router();
const { createRecord, getRecords, getOverview, getExpenses, getLedger } = require("../controllers/finance.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/",          protect, authorize("admin"), createRecord);               // POST /api/finance
router.get("/",           protect, authorize("admin"), getRecords);                 // GET  /api/finance
router.get("/overview",   protect, authorize("admin"), getOverview);                // GET  /api/finance/overview
router.get("/expenses",   protect, authorize("admin"), getExpenses);                // GET  /api/finance/expenses
router.get("/ledger",     protect, getLedger);                                       // GET  /api/finance/ledger  (any authenticated user)

module.exports = router;
