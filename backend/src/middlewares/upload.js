const multer = require("multer");
const path = require("path");
const ApiError = require("../utils/ApiError");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, "uploads/videos/");
    } else {
      cb(null, "uploads/images/");
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|webp/;
  const videoTypes = /mp4|mkv|webm|mov/;
  const extName = path.extname(file.originalname).toLowerCase().slice(1);

  if (imageTypes.test(extName) || videoTypes.test(extName)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only image and video files are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB max
});

module.exports = upload;
