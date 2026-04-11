// models/society.model.js

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const societySchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    address: { type: String, required: true },

    // Unique invite code for joining
    inviteCode: {
      type: String,
      unique: true,
      default: () => uuidv4().split("-")[0].toUpperCase(), // e.g. "A3F9B2"
    },

    // Available amenities in this society
    amenities: [
      {
        name:        { type: String }, // "Gym", "Pool", "Clubhouse"
        description: { type: String },
        available:   { type: Boolean, default: true },
      },
    ],

    // The user who created the society (first admin)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Society", societySchema);
