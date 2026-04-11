const router = require("express").Router();
const { createStaff, getStaff, getStaffById, updateStaff, deleteStaff } = require("../controllers/staff.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/",     protect, authorize("admin"), createStaff);           // POST   /api/staff
router.get("/",      protect, getStaff);                                  // GET    /api/staff
router.get("/:id",   protect, getStaffById);                              // GET    /api/staff/:id
router.patch("/:id", protect, authorize("admin"), updateStaff);           // PATCH  /api/staff/:id
router.delete("/:id",protect, authorize("admin"), deleteStaff);           // DELETE /api/staff/:id

module.exports = router;
