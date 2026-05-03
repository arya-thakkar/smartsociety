// services/post.service.js — Society social feed CRUD + like/unlike

const Post = require("../models/post.model");
const aiService = require("./ai.service");
const { uploadImage } = require("./cloudinary.service");

/**
 * Create a new feed post with optional image and AI sentiment analysis
 */
const createPost = async (data, userId, societyId, imageFile = null) => {
  let image = null, imagePublicId = null;
  if (imageFile) {
    const result = await uploadImage(imageFile.buffer, "feed-posts");
    image = result.url;
    imagePublicId = result.publicId;
  }

  // AI sentiment analysis (best-effort, fallback to Neutral)
  let sentiment = "Neutral";
  try {
    sentiment = await analyzeSentiment(data.content);
  } catch (err) {
    console.error("Sentiment analysis failed, defaulting to Neutral:", err.message);
  }

  const post = await Post.create({
    ...data,
    author: userId,
    society: societyId,
    image,
    imagePublicId,
    sentiment,
    likes: [],
  });

  return Post.findById(post._id).populate("author", "name unit photo");
};

/**
 * Get all posts for a society, newest first
 */
const getPosts = async (societyId) => {
  return Post.find({ society: societyId })
    .populate("author", "name unit photo")
    .sort({ createdAt: -1 })
    .limit(100);
};

/**
 * Toggle like on a post — add userId if not present, remove if already liked
 */
const toggleLike = async (postId, userId, societyId) => {
  const post = await Post.findOne({ _id: postId, society: societyId });
  if (!post) throw { status: 404, message: "Post not found" };

  const index = post.likes.indexOf(userId);
  if (index === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(index, 1);
  }

  // Mark as trending if likes exceed threshold
  post.trending = post.likes.length >= 5;

  await post.save();
  return Post.findById(post._id).populate("author", "name unit photo");
};

/**
 * Simple AI sentiment analysis using Gemini
 */
const analyzeSentiment = async (text) => {
  try {
    const prompt = `Analyze the sentiment of this social media post from a residential community. 
Respond with ONLY one word: Positive, Negative, or Neutral.

Post: "${text}"`;
    const result = await require("./ai.service").__callGemini
      ? require("./ai.service").__callGemini(prompt)
      : "Neutral";
    const s = result.trim();
    return ["Positive", "Negative", "Neutral"].includes(s) ? s : "Neutral";
  } catch {
    return "Neutral";
  }
};

module.exports = { createPost, getPosts, toggleLike };
