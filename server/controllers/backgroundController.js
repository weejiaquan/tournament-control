import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bgUploadsDir = path.join(__dirname, '../../uploads/bgimg');

let backgroundState = {
  currentBackground: ''
};

export const uploadBackground = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: `/uploads/bgimg/${req.file.filename}` });
};

export const getBackgrounds = (req, res) => {
  fs.readdir(bgUploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read uploads directory' });
    }
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => ({
        url: `/uploads/bgimg/${file}`
      }));
    res.json(images);
  });
};

export const deleteBackground = (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(bgUploadsDir, filename);

  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete image' });
    }
    res.json({ success: true });
  });
};

export const setBackground = (req, res) => {
  const { backgroundImage } = req.body;
  backgroundState.currentBackground = backgroundImage;
  res.json({ success: true });
};

export const getCurrentBackground = (req, res) => {
  res.json({ backgroundImage: backgroundState.currentBackground });
};