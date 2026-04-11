// models/booking.model.js — Amenity booking requests

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    society:      { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    bookedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amenityName:  { type: String, required: true }, // "Gym", "Pool", etc.
    date:         { type: Date, required: true },
    timeSlot:     { type: String, required: true }, // "10:00 AM - 12:00 PM"
    purpose:      { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: { type: String }, // Reason for rejection, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
