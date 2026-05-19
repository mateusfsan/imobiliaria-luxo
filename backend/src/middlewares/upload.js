import multer from 'multer';
import { HttpError } from './errorHandler.js';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE = 8 * 1024 * 1024;

export const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE, files: 20 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      return cb(new HttpError(400, 'INVALID_FILE_TYPE', 'Formato de imagem nao suportado'));
    }
    cb(null, true);
  },
}).array('images', 20);
