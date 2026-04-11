// models/amenity.model.js
// Amenities are now a separate collection (not embedded in society)
// Admin adds amenities AND time slots via dashboard AFTER society creation.

const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  label:     { type: String, required: true }, // e.g. "6:00 AM - 8:00 AM"
  startTime: { type: String, required: true }, // "06:00"
  endTime:   { type: String, required: true }, // "08:00"
  capacity:  { type: Number, default: 1 },     // max concurrent bookings
  active:    { type: Boolean, default: true },
});

const amenitySchema = new mongoose.Schema(
  {
    society:     { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    name:        { type: String, required: true },      // "Gym", "Pool", "Clubhouse"
    description: { type: String },
    available:   { type: Boolean, default: true },
    slots:       [slotSchema],                          // Admin adds slots from dashboard
  },
  { timestamps: true }
);

module.exports = mongoose.model("Amenity", amenitySchema);
