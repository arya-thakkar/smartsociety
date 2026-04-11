// models/announcement.model.js

const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    society:   { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:     { type: String, required: true },
    body:      { type: String, required: true },
    priority:  { type: String, enum: ["normal", "urgent"], default: "normal" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
