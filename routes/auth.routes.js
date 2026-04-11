const router = require("express").Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");

router.post("/register", upload.single("photo"), register);  // POST /api/auth/register  (multipart, optional photo)
router.post("/login",    login);                             // POST /api/auth/login
router.get("/me",        protect, getMe);                   // GET  /api/auth/me

module.exports = router;
