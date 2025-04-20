import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import shiftRoutes from './routes/shifts.routes';
import paymentRoutes from './routes/payments.routes';
import receiptRoutes from './routes/receipt.routes';
import tipRoutes from './routes/tips.routes';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/shifts', shiftRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/tips', tipRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;