import { Router } from 'express';
import { generateShiftReceipt } from '../controllers/receipt.controller';

const router = Router();

router.get('/:shiftId', generateShiftReceipt);

export default router;