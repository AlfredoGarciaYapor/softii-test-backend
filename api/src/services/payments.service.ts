import Payment from '../models/payment.model';
import Tip from '../models/tip.model';
import { IPayment } from '../types';

export const createPayment = async (
  amount: number,
  method: string,
  tipId: string
): Promise<IPayment> => {
  // 1. Validar la propina existe
  const tip = await Tip.findById(tipId);
  console.log(tip);
  if (!tip) {
    console.log('error');
    throw new Error('Propina no encontrada');
  }

  // 2. Validar que no exceda el monto pendiente
  const payments = await Payment.find({ tip: tipId });
  const totalPagado = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendiente = tip.amount - totalPagado;

  if (amount > pendiente) {
    throw new Error(`El pago excede el monto pendiente ($${pendiente.toFixed(2)})`);
  }

  // 3. Crear el pago
  const payment = new Payment({
    amount,
    method,
    tipId,
  });

  const savedPayment = await payment.save();

  await Tip.findByIdAndUpdate(
      tipId,
      { 
        $push: { payments: savedPayment._id },
      }
    ).exec();

  // 4. Actualizar estado de la propina si se completó
  // const nuevoTotalPagado = totalPagado + amount;
  // if (nuevoTotalPagado >= tip.amount) {
  //   await Tip.findByIdAndUpdate(
  //     tipId,
  //     { isPaid: true },
  //     { new: true }
  //   ).exec();
  // }

  return savedPayment;
};

export const getPaymentsByShift = async (tipId: string): Promise<IPayment[]> => {
  return await Payment.find({ tip: tipId }).exec();
};

export const getPaymentsByTip = async (tipId: string): Promise<IPayment[]> => {
  return await Payment.find({ tipId }).exec();
};