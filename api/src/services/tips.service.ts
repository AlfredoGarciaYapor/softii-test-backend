import { model } from 'mongoose';
import Tip from '../models/tip.model';
import Shift from '../models/shift.model';
import { ITip } from '../types';

export const createTip = async (amount: number, splitCount: number, shiftId: string): Promise<ITip> => {
  
  // Crear la propina
  const tip = new Tip({
    amount,
    splitCount,
    shift: shiftId
  });

  // Guardar la propina
  const savedTip = await tip.save();
  
  // Actualizar el turno con la referencia a la nueva propina
  await Shift.findByIdAndUpdate(
    shiftId,
    { 
      $push: { tips: savedTip._id },
      $inc: { totalTips: amount }
    }
  ).exec();

  return savedTip;
};

export const getTipsByShift = async (shiftId: string): Promise<ITip[]> => {
  return await Tip.find({ shift: shiftId }).exec();
};

export const markTipAsPaid = async (tipId: string): Promise<ITip | null> => {
  return await Tip.findByIdAndUpdate(
    tipId,
    { isPaid: true },
    { new: true }
  ).exec();
};

export const calculateRemainingAmount = async (tipId: string): Promise<number> => {
  const tip = await Tip.findById(tipId).exec();
  if (!tip) return 0;
  
  const Payment = model('Payment');
  const payments = await Payment.find({ tip: tipId });
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  
  return tip.amount - paidAmount;
};