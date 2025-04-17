// Actualmente innecesario con Prisma, pero si quisieras usar lógica de dominio:
export interface TipSessionInput {
  totalAmount: number;
  dividedBy: number;
}

export interface PaymentInput {
  amount: number;
  method: 'CASH' | 'CARD_SANTANDER' | 'CARD_BBVA' | 'OTHER';
}
