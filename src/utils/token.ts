import { SECRET_KEY } from '@/config';
import jwt from 'jsonwebtoken';

export function generateToken(_id: string) {
  return jwt.sign({ _id }, SECRET_KEY, { expiresIn: '1d' }); 
}

