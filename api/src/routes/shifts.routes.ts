import { Router } from 'express';
import { 
  startNewShift, 
  getCurrentShiftController, 
  closeCurrentShift 
} from '../controllers/shifts.controller';

const router = Router();

router.post('/', startNewShift);
router.get('/current', getCurrentShiftController);
router.put('/:shiftId/close', closeCurrentShift);

export default router;