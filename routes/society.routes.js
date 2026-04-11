const router = require("express").Router();
const { createSociety, joinSociety, getSociety, updateSociety } = require("../controllers/society.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/",        protect, createSociety);                         // POST   /api/society
router.post("/join",    protect, joinSociety);                           // POST   /api/society/join
router.get("/",         protect, authorize("admin","resident","guard"), getSociety);   // GET    /api/society
router.patch("/",       protect, authorize("admin"), updateSociety);     // PATCH  /api/society

module.exports = router;
