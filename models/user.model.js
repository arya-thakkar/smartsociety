// models/user.model.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const familyMemberSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  relation: { type: String }, // "spouse", "child", "parent", etc.
  photo:    { type: String }, // Cloudinary URL
  photoPublicId: { type: String },
});

const staffEntrySchema = new mongoose.Schema({
  name:     { type: String, required: true },
  type:     { type: String, enum: ["maid", "driver", "cook", "other"], default: "maid" },
  photo:    { type: String }, // Cloudinary URL
  photoPublicId: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // Profile photo (Cloudinary)
    photo:          { type: String },
    photoPublicId:  { type: String },

    role: {
      type: String,
      enum: ["pending", "resident", "admin", "guard"],
      default: "pending",
    },

    society: { type: mongoose.Schema.Types.ObjectId, ref: "Society" },
    unit:    { type: String },

    // Resident's family members
    familyMembers: [familyMemberSchema],

    // Resident's household staff (maids, drivers, etc.)
    householdStaff: [staffEntrySchema],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", userSchema);
