import express from 'express';
import { 
  getTimer, 
  setTimer, 
  toggleTimer,
  setTimerStyle,
  getTimerStyle,
  getTimerGradients,
  setTimerGradients 
} from '../controllers/timerController.js';

const router = express.Router();

// Existing routes
router.get('/api/timer', getTimer);
router.post('/api/timer/set', setTimer);
router.post('/api/timer/toggle', toggleTimer);

// Timer style routes
router.get('/api/timer/style', getTimerStyle);
router.post('/api/timer/style', setTimerStyle);

// Timer gradient routes
router.get('/api/timer/gradients', getTimerGradients);
router.post('/api/timer/gradients', setTimerGradients);

export default router;