import express from 'express';
import { themes } from '../../src/config/display/themes.js';

const router = express.Router();

router.get('/api/themes', (req, res) => {
  // Convert themes object to array with name property
  const themesArray = Object.entries(themes).map(([name, theme]) => ({
    name,
    ...theme
  }));
  res.json(themesArray);
});

export default router;