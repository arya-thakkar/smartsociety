// models/complaint.model.js

const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    society:     { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    raisedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    priority:    { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    adminNote:  { type: String },
    resolvedAt: { type: Date },

    // Proof images uploaded to Cloudinary
    images: [
      {
        url:      { type: String },
        publicId: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
