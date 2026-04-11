const router = require("express").Router();
const { createBooking, getBookings, updateBookingStatus } = require("../controllers/booking.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/",        protect, authorize("resident","admin"), createBooking);    // POST  /api/bookings
router.get("/",         protect, getBookings);                                     // GET   /api/bookings
router.patch("/:id",    protect, authorize("admin"), updateBookingStatus);         // PATCH /api/bookings/:id

module.exports = router;
