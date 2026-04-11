// models/staff.model.js

const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    society: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    name:    { type: String, required: true },
    role:    { type: String, default: "General" }, // e.g. Cleaner, Security, Plumber
    phone:   { type: String },
    photo:   { type: String }, // URL/path — face recognition placeholder for future
    active:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
