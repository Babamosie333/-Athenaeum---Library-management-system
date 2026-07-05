const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Keep the file in memory; we upload it to Cloudinary ourselves (no multer-storage-cloudinary,
// which only supports the old Cloudinary v1 SDK and conflicts with v2).
const upload = multer({ storage: multer.memoryStorage() });

// Uploads a buffer (req.file.buffer) to Cloudinary and returns the secure URL.
const uploadBufferToCloudinary = (buffer, folder = "library-covers") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, allowed_formats: ["jpg", "jpeg", "png", "webp"], transformation: [{ width: 600, height: 900, crop: "limit" }] },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

module.exports = { cloudinary, upload, uploadBufferToCloudinary };
