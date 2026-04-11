/**
 * services/cloudinary.service.js
 *
 * Handles all image uploads to Cloudinary.
 * Used for: user profile photos, complaint proof images,
 *           family member photos, maid/staff photos.
 */

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} buffer     - File buffer from multer
 * @param {string} folder     - Cloudinary folder (e.g. "profiles", "complaints")
 * @param {string} [publicId] - Optional custom public_id
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadImage = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const options = { folder, resource_type: "image" };
    if (publicId) options.public_id = publicId;

    const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve({ url: result.secure_url, publicId: result.public_id });
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Delete an image from Cloudinary by publicId
 */
const deleteImage = async (publicId) => {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, deleteImage };
