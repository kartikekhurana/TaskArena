// lib/multer.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public/uploads/profile-pictures");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, "public/uploads/profile-pictures");
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    cb(error);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file
  }
});

// Alternative: Memory storage for direct handling in API routes
export const memoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  }
});

// Types for better TypeScript support
export interface UploadedFile extends Express.Multer.File {
  path: string;
  filename: string;
}

// Utility function to handle file upload errors
export const handleUploadError = (error: any): string => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return 'File too large. Maximum size is 5MB.';
      case 'LIMIT_FILE_COUNT':
        return 'Too many files. Only one file is allowed.';
      case 'LIMIT_UNEXPECTED_FILE':
        return 'Unexpected file field.';
      default:
        return `Upload error: ${error.message}`;
    }
  }
  return error.message || 'Unknown upload error';
};