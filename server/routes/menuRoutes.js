import express from 'express';
import { 
  uploadMenuItem, 
  getMenuItems, 
  toggleMenuItem, 
  deleteMenuItem,
  setMenuVisibility,
  getMenuVisibility 
} from '../controllers/menuController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/api/menu/upload', upload.single('menuItem'), uploadMenuItem);
router.get('/api/menu/items', getMenuItems);
router.patch('/api/menu/items/:id/toggle', toggleMenuItem);
router.delete('/api/menu/items/:id', deleteMenuItem);
router.post('/api/menu/visibility', setMenuVisibility);
router.get('/api/menu/visibility', getMenuVisibility);


export default router;