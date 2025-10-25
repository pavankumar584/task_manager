import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import { adminConfig } from '@/config/admin.config';
import { SECRET_KEY } from '@/config';

interface AuthenticatedAdminRequest extends Request {
  admin?: { email: string; role: string };
}

export const AdminAuthMiddleware = (req: AuthenticatedAdminRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token is required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is required' });
    }

    let decoded: any;
    try {
      decoded = Jwt.verify(token, SECRET_KEY);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach admin info from config
    if (decoded.email !== adminConfig.email) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.admin = {
      email: adminConfig.email,
      role: 'admin',
    };

    next();
  } catch (err) {
    return res.status(400).json({ message: 'Unauthorized access', error: (err as Error).message });
  }
};