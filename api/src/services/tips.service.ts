import prisma from '../database/db';
import { PaymentMethod } from '@prisma/client';

const createShift = async (totalAmount: number, dividedBy: number) => {
  return await prisma.tipSession.create({
    data: {
      totalAmount,
      dividedBy,
    },
  });
};

const registerPayment = async (
  tipSessionId: number,
  amount: number,
  method: PaymentMethod
) => {
  return await prisma.payment.create({
    data: {
      amount,
      method,
      tipSessionId,
    },
  });
};

const getTipSession = async (id: number) => {
  const session = await prisma.tipSession.findUnique({
    where: { id },
    include: { payments: true },
  });

  if (!session) throw new Error('Tip session not found');

  const totalPaid = session.payments.reduce((acc, p) => acc + p.amount, 0);
  const remaining = session.totalAmount - totalPaid;
  const perPerson = session.dividedBy > 0 ? session.totalAmount / session.dividedBy : 0;

  return {
    id: session.id,
    totalAmount: session.totalAmount,
    dividedBy: session.dividedBy,
    perPerson: perPerson.toFixed(2),
    totalPaid,
    remaining,
    payments: session.payments,
  };
};

export default {
  createShift,
  registerPayment,
  getTipSession,
};
