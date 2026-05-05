import dotenv from 'dotenv';

dotenv.config();

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
