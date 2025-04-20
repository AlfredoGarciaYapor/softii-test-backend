import { Request, Response } from 'express';
import { createPayment, getPaymentsByShift, getPaymentsByTip } from '../services/payments.service';

export const addPayment = async (req: Request, res: Response) => {
  try {
    const { tipId } = req.params;
    const { amount, method } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const payment = await createPayment(amount, method, tipId);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding payment' });
  }
};

export const listPayments = async (req: Request, res: Response) => {
  try {
    const { tipId } = req.params;
    const payments = await getPaymentsByShift(tipId);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error listing payments' });
  }
};