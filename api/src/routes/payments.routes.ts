import { Router } from 'express';
import { addPayment, listPayments } from '../controllers/payments.controller';

const router = Router();

router.post('/:tipId', addPayment);
router.get('/:tipId', listPayments);

export default router;