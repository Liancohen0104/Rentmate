import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export async function uploadToCloudinary(file, { folder = "chat_attachments" } = {}) {
  if (!file || !file.buffer) return null;

  const resource_type = file.mimetype?.startsWith("video/")
    ? "video"
    : "image";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type },
      (err, result) => {
        if (err) return reject(err);
        resolve(result?.secure_url || null);
      }
    );
    stream.end(file.buffer);
  });
}

export { cloudinary };
