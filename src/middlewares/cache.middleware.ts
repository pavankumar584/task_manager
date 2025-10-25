import { Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RequestWithUser } from '@interfaces/auth.interface'; 

const redis = new Redis(); // default localhost:6379

export const cacheMiddleware = (keyPrefix: string, ttl: number = 60) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const key = `${keyPrefix}:${JSON.stringify(req.query)}:${req.user?._id ?? 'guest'}`;
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        redis.set(key, JSON.stringify(body), 'EX', ttl).catch(err => {
          console.error('Redis cache set error:', err);
        });
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('Redis cache error:', err);
      next();
    }
  };
};
