// models/log.model.js — Gate entry/exit logs

const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    society:    { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    visitor:    { type: mongoose.Schema.Types.ObjectId, ref: "Visitor" },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Guard
    action:     { type: String, enum: ["entry", "exit", "denied"], required: true },
    note:       { type: String },
    timestamp:  { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
