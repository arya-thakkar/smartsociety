// routes/post.routes.js — Society social feed
const router = require("express").Router();
const { createPost, getPosts, likePost } = require("../controllers/post.controller");
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");

router.get("/",          protect, getPosts);                                        // GET  /api/posts
router.post("/",         protect, upload.single("image"), createPost);              // POST /api/posts  (multipart, optional image)
router.post("/:id/like", protect, likePost);                                        // POST /api/posts/:id/like

module.exports = router;
