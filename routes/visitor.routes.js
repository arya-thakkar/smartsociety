const router = require("express").Router();
const { addVisitor, verifyVisitor, getVisitors } = require("../controllers/visitor.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/",        protect, authorize("resident","admin"), addVisitor);     // POST /api/visitor
router.post("/verify",  protect, authorize("guard","admin"),    verifyVisitor);  // POST /api/visitor/verify
router.get("/",         protect, getVisitors);                                   // GET  /api/visitor

module.exports = router;
