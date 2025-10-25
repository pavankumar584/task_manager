import { RequestWithUser } from '@/interfaces/auth.interface';
import { UserModel } from '@/models/users.model';
import { TaskModel } from '@/models/task.model';
import { MainService } from './main.service';
import { reject } from '@/utils/error';
import { Request, Response } from 'express';

export class ManagerService extends MainService {
  constructor(req: Request, res: Response) {
    super(req as RequestWithUser, res);
  }
  public getProfileService = async () => {
    const manager = await UserModel.findById(this.req.user._id).select('username email roles managerId');
    if (!manager) return reject('Manager not found');
    return manager;
  };

  public getTeamMembersService = async () => {
    const team = await UserModel.find({ managerId: this.req.user._id }).select('username email roles');
    return team;
  };

  public getUserUnderTeamService = async () => {
    const { id } = this.req.params;
    const teamUserIds = await UserModel.find({ managerId: this.req.user._id }).distinct('_id');
    if (!teamUserIds.includes(id)) return reject('Access denied: user not under your team');

    const user = await UserModel.findById(id).select('username email roles');
    return user;
  };

  public assignTaskService = async () => {
    const { taskId, userId } = this.req.body;
    const task = await TaskModel.findById(taskId);
    if (!task) return reject('Task not found');

    const teamUserIds = await UserModel.find({ managerId: this.req.user._id }).distinct('_id');
    if (!teamUserIds.includes(userId)) return reject('Cannot assign outside your team');

    task.assignedTo = userId;
    await task.save();
    return { message: 'Task assigned successfully' };
  };
}
