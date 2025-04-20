import { Router } from 'express';
import { 
  addTip, 
  listTips, 
  checkTipStatus 
} from '../controllers/tips.controller';

const router = Router();

router.post('/:shiftId', addTip);
router.get('/:shiftId', listTips);
router.get('/:tipId/status', checkTipStatus);

export default router;