import { RequestWithUser } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/auth.service';
import { Request, Response } from 'express';

export class AuthController extends AuthService {
  constructor(req: Request, res: Response) {
    super(req as RequestWithUser, res);
  }
  public login = async () => {
    try {
      const data = await this.loginService();
      this.send(data);
    } catch (error) {
      this.error(error);
    }
  };
  public register = async () => {
    try {
      const data = await this.registerService();
      this.send(data);
    } catch (error) {
      this.error(error);
    }
  };
  public logout = async () => {
    try {
      const data = await this.logoutService();
      this.send(data);
    } catch (error) {
      this.error(error);
    }
  };
}
