// models/task.model.js

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    society:     { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Specific user (optional)
    title:       { type: String, required: true },
    description: { type: String },
    priority:    { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "MEDIUM" },
    status:      { type: String, enum: ["pending", "in-progress", "completed", "Paid"], default: "pending" },
    dueDate:     { type: Date },
    completedAt: { type: Date },

    /**
     * Task type:
     *   "service"   → normal operational task (maintenance, security check)
     *   "financial"  → represents a bill/fine/maintenance fee
     */
    type: {
      type: String,
      enum: ["service", "financial"],
      default: "service",
    },

    /**
     * Amount — only applicable when type === "financial"
     * Represents the monetary value (maintenance bill, fine, etc.)
     */
    amount: { type: Number, default: 0 },

    /**
     * visibleTo controls who sees this task:
     *   "residents" → only residents see it (guards do not)
     *   "guards"    → only guards see it (residents do not)
     *   "all"       → everyone sees it
     */
    visibleTo: {
      type: String,
      enum: ["residents", "guards", "all"],
      default: "all",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
