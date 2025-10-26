import { connect, set } from 'mongoose';
import { NODE_ENV, DB_HOST, DB_PORT, DB_DATABASE, DB_URI } from '@config';

export const dbConnection = async () => {
  // Use Atlas URI in production, local MongoDB in dev
  const mongoUrl =
    NODE_ENV === 'production'
      ? DB_URI
      : `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  try {
    await connect(mongoUrl, dbOptions);
    console.log(`MongoDB connected: ${NODE_ENV}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
