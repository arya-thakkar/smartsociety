/**
 * middleware/upload.middleware.js
 *
 * Two multer instances:
 *   upload        → images only  (5MB)  — used for profiles, complaints, family
 *   uploadAudio   → audio files  (100MB) — used for meeting recordings
 */

const multer = require("multer");

const storage = multer.memoryStorage();

// ── Image upload ────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ── Audio upload ────────────────────────────────────────────────
const audioFilter = (req, file, cb) => {
  const allowed = [
    "audio/mpeg",       // .mp3
    "audio/mp4",        // .m4a
    "audio/wav",        // .wav
    "audio/x-wav",
    "audio/webm",       // .webm (browser recordings)
    "audio/ogg",        // .ogg
    "audio/aac",        // .aac
    "audio/flac",       // .flac
    "video/webm",       // some browsers tag webm audio as video/webm
    "video/mp4",        // .mp4 (screen+audio recordings)
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported audio format: ${file.mimetype}. Use mp3, mp4, m4a, wav, webm, ogg, aac or flac.`), false);
  }
};

const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

module.exports = { upload, uploadAudio };
