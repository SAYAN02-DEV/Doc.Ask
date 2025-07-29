import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;


app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  credentials: false,
}));
import userRoutes from './routes/userRoutes';
import uploadRoute from './routes/uploadRoute';

app.use('/user', userRoutes);
app.use('/api', uploadRoute)
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/doc_ask';
if (!mongoUri) {
  throw new Error('MONGO_URI environment variable not set');
}
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT,'0.0.0.0',() => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });


