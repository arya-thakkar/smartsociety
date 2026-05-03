// routes/visitor.routes.js — Visitor management (now at /api/visitors with checkout)
const router = require("express").Router();
const { addVisitor, verifyVisitor, getVisitors, checkoutVisitor } = require("../controllers/visitor.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/",              protect, authorize("resident","admin"), addVisitor);          // POST  /api/visitors
router.post("/verify",        protect, authorize("guard","admin"),    verifyVisitor);       // POST  /api/visitors/verify
router.get("/",               protect, getVisitors);                                        // GET   /api/visitors
router.patch("/:id/checkout", protect, authorize("guard","admin"),    checkoutVisitor);     // PATCH /api/visitors/:id/checkout

module.exports = router;
