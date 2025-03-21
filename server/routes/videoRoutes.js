import express from 'express';
import { getVideo, setVideo, clearVideo } from '../controllers/videoController.js';

const router = express.Router();

router.get('/api/video', getVideo);
router.post('/api/video', setVideo);
router.delete('/api/video', clearVideo);

export default router;