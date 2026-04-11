// controllers/auth.controller.js
const authService = require("../services/auth.service");

// POST /api/auth/register  — multipart/form-data with optional "photo" field
const register = async (req, res, next) => {
  try {
    const photoFile = req.file || null; // single file from upload.single("photo")
    const data = await authService.register(req.body, photoFile);
    res.status(201).json({ success: true, ...data });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
