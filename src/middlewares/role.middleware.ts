import { RequestWithUser } from '@/interfaces/auth.interface';
import { Response, NextFunction } from 'express';
import { HttpException } from '@/exceptions/httpException';

export const authorizeRoles = (allowedRoles: ('Admin' | 'Manager' | 'User')[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpException(403, 'User not authenticated'));

    // Single string role check
    if (!allowedRoles.includes(req.user.roles)) {
      return next(new HttpException(403, 'Access denied'));
    }

    next();
  };
};
