import { Request, Response } from 'express';
import Shift from '../models/shift.model';
import { getPaymentsByTip, getPaymentsByShift } from '../services/payments.service';
import { generateReceipt } from '../services/pdf.service';
import { TipSummary } from '../types';

export const generateShiftReceipt = async (req: Request, res: Response) => {
  try {
    const { shiftId } = req.params;
    const shift = await Shift.findById(shiftId).exec();

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    // Obtener todos los pagos del turno
    const allPayments = await getPaymentsByShift(shiftId);
    
    // Agrupar pagos por tipId
    const tipsMap = new Map<string, TipSummary>();
    
    allPayments.forEach(cue => {
      if (!tipsMap.has(cue.tipId.toString())) {
        tipsMap.set(cue.tipId.toString(), {
          tipId: cue.tipId.toString(),
          totalAmount: 0,
          splitCount: 0, // Este valor debería venir de otra parte
          amountPerPerson: 0,
          payments: []
        });
      }
      
      const tip = tipsMap.get(cue.tipId.toString())!;
      tip.totalAmount += cue.amount;
      tip.payments.push({
        amount: cue.amount,
        method: cue.method,
        date: cue.createdAt
      });
    });

    // Convertir map a array
    const tips = Array.from(tipsMap.values());
    
    // Generar PDF
    const pdfBuffer = await generateReceipt(shiftId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=recibo-turno-${shiftId}.pdf`
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error generating receipt' });
  }
};