// models/guestInvite.model.js — Pre-approved guest invites by residents

const mongoose = require("mongoose");

const guestInviteSchema = new mongoose.Schema(
  {
    society:    { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Resident

    name:       { type: String, required: true }, // Guest name
    date:       { type: String, required: true }, // Expected visit date
    vehicle:    { type: String },                 // Vehicle number
    flat:       { type: String },                 // Flat/unit number
    resident:   { type: String },                 // Resident name (denormalized for quick display)

    // Unique QR / invite code for gate verification
    qrCode:     { type: String, unique: true },

    status: {
      type: String,
      enum: ["Pre-Approved", "Used", "Expired", "Cancelled"],
      default: "Pre-Approved",
    },

    usedAt: { type: Date }, // When the invite was actually used at the gate
  },
  { timestamps: true }
);

module.exports = mongoose.model("GuestInvite", guestInviteSchema);
