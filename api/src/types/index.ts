import { Document, Types } from "mongoose";

export interface IPayment extends Document {
  amount: number;
  method: string;
  tipId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShift extends Document {
  startTime: Date;
  endTime?: Date;
  totalTips: number;
  splitCount: number;
  // payments: Types.ObjectId[];
  tips: Types.ObjectId[];
  isClosed: boolean;
}
export interface ITip extends Document {
  amount: number;
  splitCount: number;
  shift: Types.ObjectId;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
  payments: Types.ObjectId[];

  // Virtuals
  amountPerPerson: number;
}

export type TipSummary = {
  tipId: string;
  totalAmount: number;
  splitCount: number;
  amountPerPerson: number;
  payments: {
    amount: number;
    method: string;
    date: Date;
  }[];
};
