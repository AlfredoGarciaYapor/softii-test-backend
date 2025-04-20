import { Schema, model } from 'mongoose';
import { IPayment } from '../types';

const PaymentSchema = new Schema<IPayment>({
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  tipId: { type: Schema.Types.ObjectId, ref: 'Tip', required: true },
  //tipId: { type: String, required: true } // Nuevo campo para identificar la propina específica
}, { timestamps: true });

export default model<IPayment>('Payment', PaymentSchema);