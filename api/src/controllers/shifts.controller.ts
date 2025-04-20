import { Request, Response } from 'express';
import Shift from '../models/shift.model';
import { createShift, getCurrentShift, closeShift } from '../services/shifts.service';

export const startNewShift = async (req: Request, res: Response) => {
  try {
    const shift = await createShift();
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error creating shift' });
  }
};

export const getCurrentShiftController = async (req: Request, res: Response) => {
  try {
    const shift = await getCurrentShift();
    res.json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching current shift' });
  }
};

export const getShiftDetails = async (req: Request, res: Response) => {
  try {
    const { shiftId } = req.params;
    const shift = await Shift.findById(shiftId)
      .populate({
        path: 'tips',
        select: 'amount splitCount isPaid createdAt'
      })
      .exec();

    if (!shift) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el turno' });
  }
};

export const closeCurrentShift = async (req: Request, res: Response) => {
  try {
    const { shiftId } = req.params;
    const shift = await closeShift(shiftId);
    res.json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error closing shift' });
  }
};