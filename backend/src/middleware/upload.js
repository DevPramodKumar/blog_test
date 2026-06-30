import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const fileFilter = (_req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'));
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export { uploadsDir };
