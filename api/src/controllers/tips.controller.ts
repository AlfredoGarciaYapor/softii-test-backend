import { Request, Response } from 'express';
import tipService from '../services/tips.service';

export const createShift = async (req: Request, res: Response) => {
  const { totalAmount, dividedBy } = req.body;
  const session = await tipService.createShift(totalAmount, dividedBy);
  res.status(201).json(session);
};

export const registerPayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, method } = req.body;
  const payment = await tipService.registerPayment(Number(id), amount, method);
  res.status(201).json(payment);
};

export const getTipSession = async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = await tipService.getTipSession(Number(id));
  res.status(200).json(session);
};
