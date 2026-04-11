const router = require("express").Router();
const { getMembers, getMember, changeRole, removeMember, addFamilyMember, removeFamilyMember, addHouseholdStaff, removeHouseholdStaff } = require("../controllers/member.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");

// Admin member management
router.get("/",          protect, authorize("admin"), getMembers);        // GET    /api/members
router.get("/:id",       protect, authorize("admin"), getMember);         // GET    /api/members/:id
router.patch("/:id/role",protect, authorize("admin"), changeRole);        // PATCH  /api/members/:id/role
router.delete("/:id",    protect, authorize("admin"), removeMember);      // DELETE /api/members/:id

// Resident self-service: family members (with optional photo)
router.post("/me/family",              protect, authorize("resident"), upload.single("photo"), addFamilyMember);    // POST   /api/members/me/family
router.delete("/me/family/:memberId",  protect, authorize("resident"), removeFamilyMember);                         // DELETE /api/members/me/family/:memberId

// Resident self-service: household staff (maids, drivers, etc.)
router.post("/me/staff",               protect, authorize("resident"), upload.single("photo"), addHouseholdStaff);  // POST   /api/members/me/staff
router.delete("/me/staff/:staffId",    protect, authorize("resident"), removeHouseholdStaff);                        // DELETE /api/members/me/staff/:staffId

module.exports = router;
