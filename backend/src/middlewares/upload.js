const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const ApiError = require("../utils/ApiError");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = "eduflow/images";
    let resourceType = "image";

    if (file.mimetype.startsWith("video/")) {
      folderName = "eduflow/videos";
      resourceType = "video";
    }

    return {
      folder: folderName,
      resource_type: resourceType,
      allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "mkv", "webm", "mov"],
    };
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
