// models/post.model.js — Society social feed posts

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    society:   { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    author:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content:   { type: String, required: true },
    image:     { type: String }, // Cloudinary URL for optional image attachment
    imagePublicId: { type: String },

    // Array of user IDs who liked this post
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // AI-generated sentiment analysis
    sentiment: {
      type: String,
      enum: ["Positive", "Negative", "Neutral"],
      default: "Neutral",
    },

    trending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
