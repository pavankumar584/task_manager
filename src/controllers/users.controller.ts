import { Request, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { UserService } from '@/services/users.service';

export class UserController extends UserService {
  constructor(req: Request, res: Response) {
    super(req as RequestWithUser, res);
  }

  public getProfile = async () => {
    try {
      const profile = await this.getProfileService();
      this.send(profile);
    } catch (error) {
      this.error(error);
    }
  };

  public getTasks = async () => {
    try {
      const tasks = await this.getTasksService();
      this.send(tasks);
    } catch (error) {
      this.error(error);
    }
  };

  public createTask = async () => {
    try {
      const task = await this.createTaskService();
      this.send(task);
    } catch (error) {
      this.error(error);
    }
  };

  public updateTask = async () => {
    try {
      const task = await this.updateTaskService();
      this.send(task);
    } catch (error) {
      this.error(error);
    }
  };

  public deleteTask = async () => {
    try {
      const task = await this.deleteTaskService();
      this.send(task);
    } catch (error) {
      this.error(error);
    }
  };
}
