import express from 'express';
import cors from 'cors';
import tipsRoutes from './routes/tips.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', tipsRoutes);

export default app;
