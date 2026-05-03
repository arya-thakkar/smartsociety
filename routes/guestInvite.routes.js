// routes/guestInvite.routes.js — Pre-approved guest invites
const router = require("express").Router();
const { createInvite, getInvites, deleteInvite, verifyInvite } = require("../controllers/guestInvite.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.get("/",          protect, getInvites);                                      // GET    /api/invites
router.post("/",         protect, authorize("resident", "admin"), createInvite);    // POST   /api/invites
router.delete("/:id",   protect, authorize("resident", "admin"), deleteInvite);    // DELETE /api/invites/:id
router.post("/verify",   protect, authorize("guard", "admin"), verifyInvite);       // POST   /api/invites/verify

module.exports = router;
