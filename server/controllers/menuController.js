import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const menuUploadsDir = path.join(__dirname, '../../uploads/menu');

// Ensure uploads directory exists
fs.mkdirSync(menuUploadsDir, { recursive: true });

let menuState = {
  items: [],
  isVisible: true
};

export const uploadMenuItem = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const newItem = {
    id: uuidv4(),
    imageUrl: `/uploads/menu/${req.file.filename}`,
    unavailable: false
  };

  menuState.items.push(newItem);
  res.json(newItem);
};

export const getMenuItems = (req, res) => {
  res.json(menuState.items);
};

export const toggleMenuItem = (req, res) => {
  const item = menuState.items.find(item => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  item.unavailable = !item.unavailable;
  res.json(item);
};

export const deleteMenuItem = (req, res) => {
  const itemIndex = menuState.items.findIndex(item => item.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const item = menuState.items[itemIndex];
  const filename = item.imageUrl.split('/').pop();
  const filepath = path.join(menuUploadsDir, filename);

  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete image file' });
    }
    menuState.items.splice(itemIndex, 1);
    res.json({ success: true });
  });
};

export const setMenuVisibility = (req, res) => {
  const { isVisible } = req.body;
  menuState.isVisible = isVisible;
  res.json({ success: true, isVisible });
};

export const getMenuVisibility = (req, res) => {
  res.json({ isVisible: menuState.isVisible });
};