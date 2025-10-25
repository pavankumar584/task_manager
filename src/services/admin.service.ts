import { Request, Response } from 'express';
import { MainService } from './main.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { TaskModel } from '@/models/task.model';
import { UserModel } from '@/models/users.model';
import { adminConfig } from '@/config/admin.config';
import { hashPassword } from '@/utils/hash';
import { reject } from '@/utils/error';
import Jwt from 'jsonwebtoken';
import { SECRET_KEY } from '@/config';
import { AdminValidationInterface } from '@/validation/admin.validation';

export class AdminService extends MainService {
  constructor(req: Request, res: Response) {
    super(req as RequestWithUser, res);
  }

  public adminLoginService = async () => {
    const { email, password } = this.req.body as AdminValidationInterface;
    const hashedInputPassword = hashPassword(password);

    if (email !== adminConfig.email || hashedInputPassword !== adminConfig.passwordHash) {
      reject('Invalid credentials');
    }

    const token = Jwt.sign({ email: adminConfig.email, role: 'admin' }, SECRET_KEY, { expiresIn: '1d' });

    return {
      message: 'Login Successfully..!',
      token,
      admin: { name: 'Admin', email: adminConfig.email },
    };
  };

  // Admin: get all users
  public getAllUsersService = async () => {
    const users = await UserModel.find({}, { password: 0 });
    return users;
  };

  // Admin: assign task to any user
  public assignTaskService = async () => {
    const { taskId, userId } = this.req.body;
    const task = await TaskModel.findById(taskId);
    if (!task) return reject('Task not found');

    const userExists = await UserModel.findById(userId);
    if (!userExists) return reject('User not found');

    task.assignedTo = userId;
    await task.save();
    return { message: 'Task assigned successfully by Admin', task };
  };
}
