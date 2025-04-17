import { PaymentMethod } from '@prisma/client';

export interface createShiftDTO {
  totalAmount: number;
  dividedBy: number;
}

export interface RegisterPaymentDTO {
  amount: number;
  method: PaymentMethod;
}
