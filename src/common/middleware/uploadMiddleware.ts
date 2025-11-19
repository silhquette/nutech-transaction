import multer from "multer";
import type { Request } from "express";

// Allowed MIME types
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

// Custom file filter
const fileFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	// Check MIME type
	if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
		return cb(new Error("FORMAT_IMAGE_INVALID"));
	}

	cb(null, true);
};

// Memory storage (file will be in req.file.buffer)
const storage = multer.memoryStorage();

// Multer upload configuration
export const uploadSingle = multer({
	storage: storage,
	limits: {
		fileSize: MAX_FILE_SIZE,
	}, 
	fileFilter: fileFilter,
});