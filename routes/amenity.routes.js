// routes/amenity.routes.js
const router = require("express").Router();
const { getAmenities, addAmenity, updateAmenity, addSlot, updateSlot, deleteSlot } = require("../controllers/amenity.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Amenity CRUD
router.get("/",         protect, getAmenities);                           // GET   /api/amenities
router.post("/",        protect, authorize("admin"), addAmenity);         // POST  /api/amenities
router.patch("/:id",    protect, authorize("admin"), updateAmenity);      // PATCH /api/amenities/:id

// Slot management (admin only — from dashboard)
router.post("/:id/slots",              protect, authorize("admin"), addSlot);     // POST   /api/amenities/:id/slots
router.patch("/:id/slots/:slotId",     protect, authorize("admin"), updateSlot);  // PATCH  /api/amenities/:id/slots/:slotId
router.delete("/:id/slots/:slotId",    protect, authorize("admin"), deleteSlot);  // DELETE /api/amenities/:id/slots/:slotId

module.exports = router;
