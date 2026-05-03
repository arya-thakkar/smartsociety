// models/transaction.model.js — Financial transactions for society ledger

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    society:     { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },        // Resident who paid (for credits)
    recordedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },        // Admin who recorded (for debits)
    task:        { type: mongoose.Schema.Types.ObjectId, ref: "Task" },        // Linked financial task (if any)

    type:        { type: String, enum: ["credit", "debit"], required: true },  // credit=resident payment, debit=admin expense
    category:    { type: String, required: true },                              // "maintenance", "security", "utilities", "fine", etc.
    amount:      { type: Number, required: true },
    description: { type: String },
    date:        { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
