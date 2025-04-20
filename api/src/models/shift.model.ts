import { Schema, model } from 'mongoose';
import { IShift } from '../types';

const ShiftSchema = new Schema<IShift>({
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  totalTips: { type: Number, default: 0 },
  splitCount: { type: Number, default: 1 },
  tips: [{ type: Schema.Types.ObjectId, ref: 'Tip' }],
  isClosed: { type: Boolean, default: false }
});

export default model<IShift>('Shift', ShiftSchema);