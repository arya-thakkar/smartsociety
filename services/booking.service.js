// services/booking.service.js

const Booking = require("../models/booking.model");

const createBooking = async (data, userId, societyId) => {
  // Check for conflicting booking on same amenity + date + slot
  const conflict = await Booking.findOne({
    society: societyId,
    amenityName: data.amenityName,
    date: new Date(data.date),
    timeSlot: data.timeSlot,
    status: "approved",
  });
  if (conflict) throw { status: 409, message: "This slot is already booked" };

  return Booking.create({ ...data, bookedBy: userId, society: societyId });
};

const getBookings = async (societyId, userId, role) => {
  const filter = { society: societyId };
  if (role === "resident") filter.bookedBy = userId;
  return Booking.find(filter)
    .populate("bookedBy", "name unit")
    .sort({ date: -1 });
};

const updateBookingStatus = async (bookingId, societyId, { status, adminNote }) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId, society: societyId },
    { status, adminNote },
    { new: true }
  );
  if (!booking) throw { status: 404, message: "Booking not found" };
  return booking;
};

module.exports = { createBooking, getBookings, updateBookingStatus };
