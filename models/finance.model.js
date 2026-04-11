// models/finance.model.js — Society finance records (maintenance, expenses, etc.)

const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema(
  {
    society:     { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    recordedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type:        { type: String, enum: ["income", "expense"], required: true },
    category:    { type: String }, // "maintenance", "repair", "utilities", etc.
    amount:      { type: Number, required: true },
    description: { type: String },
    date:        { type: Date, default: Date.now },
    paidBy:      { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For income — which resident paid
  },
  { timestamps: true }
);

module.exports = mongoose.model("Finance", financeSchema);
