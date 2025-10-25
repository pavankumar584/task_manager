import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const ValidationMiddleware = (Schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = Schema.validate(req[property]);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    next();
  };
};
