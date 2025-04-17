import { Router } from 'express';
import {
  createShift,
  registerPayment,
  getTipSession,
} from '../controllers/tips.controller';

const router = Router();

router.post('/tips', createShift);
router.post('/tips/:id/payments', registerPayment);
router.get('/tips/:id', getTipSession);

export default router;
