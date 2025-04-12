import { config } from 'dotenv';
import mongoose from 'mongoose';

config({ path: '.env' });

const MONGODB_URI = process.env.DB_URI as string;

export const connectDB = () =>
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('CONNECTED'))
    .catch(err => console.log('error is:', err));
