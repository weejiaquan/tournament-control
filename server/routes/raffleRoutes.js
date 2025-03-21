import express from 'express';
import { 
  getParticipants, 
  addParticipants, 
  deleteParticipants,
  getSpinUpdates,
  spinRaffle 
} from '../controllers/raffleController.js';

const router = express.Router();

router.get('/api/raffle/participants', getParticipants);
router.post('/api/raffle/participants', addParticipants);
router.delete('/api/raffle/participants', deleteParticipants);
router.get('/api/raffle/spin-updates', getSpinUpdates);
router.post('/api/raffle/spin', spinRaffle);

export default router;