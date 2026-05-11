import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
console.log('Loading .env from:', envPath);

const result = dotenv.config({ path: envPath });
console.log('dotenv result:', result.error ? result.error.message : 'OK');
console.log('MONGO_URI:', process.env.MONGO_URI);

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI,
  corsOrigins: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ],
};

export function validateConfig() {
  if (!config.mongoUri) {
    throw new Error('MONGO_URI is not set');
  }
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not set');
  }
}