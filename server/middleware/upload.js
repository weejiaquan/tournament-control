import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define different upload directories
const uploadsDir = path.join(__dirname, '../../uploads');
const bgImageDir = path.join(uploadsDir, 'bgimg');
const menuDir = path.join(uploadsDir, 'menu');

// Create directories if they don't exist
[uploadsDir, bgImageDir, menuDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Create storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Choose destination based on fieldname
        if (file.fieldname === 'menuItem') {
            cb(null, menuDir);
        } else if (file.fieldname === 'image') {  // Changed from bgImage to image
            cb(null, bgImageDir);
        } else {
            cb(null, uploadsDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Single upload middleware
export const upload = multer({ storage });