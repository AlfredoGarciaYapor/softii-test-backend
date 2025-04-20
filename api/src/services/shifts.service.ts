import Shift from '../models/shift.model';
import { IShift } from '../types';

export const createShift = async (): Promise<IShift> => {
  const shift = new Shift();
  return await shift.save();
};

export const getCurrentShift = async (): Promise<IShift | null> => {
  return await Shift.findOne({ isClosed: false })
    .populate('payments')
    .exec();
};

export const closeShift = async (shiftId: string): Promise<IShift | null> => {
  return await Shift.findByIdAndUpdate(
    shiftId,
    { isClosed: true, endTime: new Date() },
    { new: true }
  ).exec();
};