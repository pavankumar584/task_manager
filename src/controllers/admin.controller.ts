import { Request, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { AdminService } from '@/services/admin.service';

export class AdminController extends AdminService {
  constructor(req: Request, res: Response) {
    super(req as RequestWithUser, res);
  }

  public adminLogin = async () => {
    try {
      const result = await this.adminLoginService();
      this.send(result);
    } catch (error) {
      this.error(error);
    }
  };

  public getAllUsers = async () => {
    try {
      const users = await this.getAllUsersService();
      this.send(users);
    } catch (error) {
      this.error(error);
    }
  };

  public assignTask = async () => {
    try {
      const task = await this.assignTaskService();
      this.send(task);
    } catch (error) {
      this.error(error);
    }
  };
}
