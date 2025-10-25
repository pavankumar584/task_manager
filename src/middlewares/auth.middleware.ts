import { RequestWithUser } from '@/interfaces/auth.interface';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '@/models/users.model';
import { SECRET_KEY } from '@/config';

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    // ✅ Updated to read _id from JWT
    const decoded = jwt.verify(token, SECRET_KEY) as { _id: string };

    // ✅ Find user by MongoDB _id
    const user = await UserModel.findById(decoded._id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};
