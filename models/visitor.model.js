// models/visitor.model.js

const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    society:       { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    addedBy:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Resident
    name:          { type: String, required: true },
    vehicleNumber: { type: String },

    // QR token — generated on creation
    qrToken:    { type: String, unique: true },
    qrImageUrl: { type: String }, // base64 or path to QR image

    // Status lifecycle
    status: {
      type: String,
      enum: ["pending", "approved", "denied", "expired"],
      default: "pending",
    },

    // When the QR expires
    expiresAt: { type: Date },

    // Entry log reference
    entryTime: { type: Date },
    exitTime:  { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
