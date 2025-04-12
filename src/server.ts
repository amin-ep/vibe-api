import { config } from 'dotenv';
import app from './app.js';
import { connectDB } from './core/database/connection.js';

config({ path: '.env' });

const PORT: number = (process.env.PORT as number | undefined) || 8000;
connectDB();
app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
