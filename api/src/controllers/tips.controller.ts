import { Request, Response } from 'express';
import { 
  createTip, 
  getTipsByShift, 
  markTipAsPaid,
  calculateRemainingAmount
} from '../services/tips.service';

export const addTip = async (req: Request, res: Response) => {
  try {
    const { shiftId } = req.params;
    const { amount, splitCount } = req.body;
    console.log(amount, splitCount);
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Monto inválido' });
    }
    
    if (!splitCount || splitCount < 1) {
      return res.status(400).json({ message: 'Número de personas inválido' });
    }
    
    const tip = await createTip(amount, splitCount, shiftId);
    res.status(201).json(tip);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear propina' });
  }
};

export const listTips = async (req: Request, res: Response) => {
  try {
    const { shiftId } = req.params;
    const tips = await getTipsByShift(shiftId);
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar propinas' });
  }
};

export const checkTipStatus = async (req: Request, res: Response) => {
  try {
    const { tipId } = req.params;
    const remaining = await calculateRemainingAmount(tipId);
    res.json({ remaining });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar estado' });
  }
};