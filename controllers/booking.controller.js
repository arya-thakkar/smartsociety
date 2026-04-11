const bookingService = require("../services/booking.service");
const createBooking = async (req, res, next) => { try { const booking = await bookingService.createBooking(req.body, req.user._id, req.user.society); res.status(201).json({ success: true, booking }); } catch (err) { next(err); } };
const getBookings = async (req, res, next) => { try { const bookings = await bookingService.getBookings(req.user.society, req.user._id, req.user.role); res.json({ success: true, bookings }); } catch (err) { next(err); } };
const updateBookingStatus = async (req, res, next) => { try { const booking = await bookingService.updateBookingStatus(req.params.id, req.user.society, req.body); res.json({ success: true, booking }); } catch (err) { next(err); } };
module.exports = { createBooking, getBookings, updateBookingStatus };
