// controllers/post.controller.js — Society social feed

const postService = require("../services/post.service");

const createPost = async (req, res, next) => {
  try {
    const imageFile = req.file || null;
    const post = await postService.createPost(req.body, req.user._id, req.user.society, imageFile);
    res.status(201).json({ success: true, post });
  } catch (err) { next(err); }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await postService.getPosts(req.user.society);
    res.json({ success: true, posts });
  } catch (err) { next(err); }
};

const likePost = async (req, res, next) => {
  try {
    const post = await postService.toggleLike(req.params.id, req.user._id, req.user.society);
    res.json({ success: true, post });
  } catch (err) { next(err); }
};

module.exports = { createPost, getPosts, likePost };
