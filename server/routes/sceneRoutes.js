import express from 'express';
import { getCurrentScene, setScene } from '../controllers/sceneController.js';

const router = express.Router();

router.get('/api/scene', getCurrentScene);
router.post('/api/scene', setScene);

export default router;