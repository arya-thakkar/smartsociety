// models/meeting.model.js

const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    society:    { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:      { type: String, required: true },
    agenda:     { type: String },
    date:       { type: Date, required: true },

    // Agora audio call
    channelName: { type: String },
    agoraToken:  { type: String },

    // Meeting lifecycle
    status: {
      type: String,
      enum: ["scheduled", "live", "ended"],
      default: "scheduled",
    },
    startedAt:    { type: Date },
    endedAt:      { type: Date },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // AI pipeline status
    aiStatus: {
      type: String,
      enum: ["not_started", "transcribing", "processing", "done", "failed"],
      default: "not_started",
    },
    aiError: { type: String }, // stores error message if aiStatus === "failed"

    // AI output
    transcript: { type: String },   // Full transcript (from AssemblyAI)
    summary:    { type: String },   // Final summary (from Claude)
    chunks:     [{ type: String }], // Intermediate chunk summaries
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
