import express from 'express';
import { 
  uploadBackground,
  getBackgrounds,
  deleteBackground,
  setBackground,
  getCurrentBackground 
} from '../controllers/backgroundController.js';
import { upload } from '../middleware/upload.js'; 

const router = express.Router();

// Updated routes to use upload middleware
router.post('/api/background/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `/uploads/bgimg/${req.file.filename}`;
    res.json({ url: imageUrl });
});

router.post('/api/upload', upload.single('image'), uploadBackground);
router.get('/api/images', getBackgrounds);
router.delete('/api/images/:filename', deleteBackground);
router.post('/api/background', setBackground);
router.get('/api/background', getCurrentBackground);

export default router;