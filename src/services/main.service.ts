import { Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';

export class MainService {
  protected req: RequestWithUser;
  protected send: (message: any) => void;
  protected error: (message: any, code?: number) => void;
  constructor(req: RequestWithUser, res: Response) {
    this.req = req;
    this.send = message => {
      res.status(200).send(message);
    };
    this.error = (error, code) => {
      const message = error?.error?.description || error?.response?.data?.message || error.message || error?.error || error;
      res.status(code || 400).send({ message, });
    };
  }
}