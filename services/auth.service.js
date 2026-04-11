// services/auth.service.js

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { uploadImage } = require("./cloudinary.service");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

/**
 * Register — accepts optional profile photo buffer
 */
const register = async ({ name, email, password }, photoFile = null) => {
  const existing = await User.findOne({ email });
  if (existing) throw { status: 400, message: "Email already registered" };

  let photo = null, photoPublicId = null;
  if (photoFile) {
    const result = await uploadImage(photoFile.buffer, "profiles");
    photo = result.url;
    photoPublicId = result.publicId;
  }

  const user = await User.create({ name, email, password, photo, photoPublicId });
  const token = generateToken(user._id);
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role, photo: user.photo } };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw { status: 401, message: "Invalid email or password" };
  }
  const token = generateToken(user._id);
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, society: user.society, photo: user.photo },
  };
};

module.exports = { register, login };
