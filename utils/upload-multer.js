const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// Define allowed file types for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject file
  }
};

// Configure multer for file uploads with memory storage and file size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Middleware to process image with sharp
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next(); // If no file is uploaded, proceed to next middleware
  }

  try {
    const processedImage = await sharp(req.file.buffer)
      .png() // Convert to PNG format
      .toBuffer();
    req.file.buffer = processedImage;
    req.file.mimetype = 'image/png'; // Update mimetype to PNG

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, processImage };
