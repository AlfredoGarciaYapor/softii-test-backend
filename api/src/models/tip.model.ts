import { Schema, model, Types } from 'mongoose';
import { ITip } from '../types';

const TipSchema = new Schema<ITip>({
  amount: { type: Number, required: true },
  splitCount: { type: Number, required: true },
  shift: { type: Schema.Types.ObjectId, ref: 'Shift', required: true },
  payments: [{ type: Schema.Types.ObjectId, ref: 'Payment'}],
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

// Middleware para actualizar el total del turno
TipSchema.post('save', async function(doc) {
  const Shift = model('Shift');
  await Shift.findByIdAndUpdate(doc.shift, {
    $inc: { totalTips: doc.amount }
  });
});

export default model<ITip>('Tip', TipSchema);