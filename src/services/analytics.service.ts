import { TaskModel } from '@/models/task.model';
import { UserModel } from '@/models/users.model';
import { MainService } from './main.service';
import { Request, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { reject } from '@/utils/error';

export class AnalyticsService extends MainService {
  public constructor(req: Request, res: Response) {
    super(req as RequestWithUser, res);
  }

  // Get stats for logged-in user
  public getUserStatsService = async () => {
    const userId = this.req.user._id;
    const now = new Date();

    const total = await TaskModel.countDocuments({ assignedTo: userId });
    const completed = await TaskModel.countDocuments({ assignedTo: userId, status: 'Completed' });
    const pending = await TaskModel.countDocuments({ assignedTo: userId, status: 'Pending' });
    const overdue = await TaskModel.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: now },
      status: { $ne: 'Completed' },
    });

    return { total, completed, pending, overdue };
  };

  // Get stats for team members under a manager
  public getTeamStatsService = async () => {
    const managerId = this.req.user._id;
    const now = new Date();
    const teamUserIds = await UserModel.find({ managerId }).distinct('_id');

    if (!teamUserIds.length) return reject('No team members found');

    const total = await TaskModel.countDocuments({ assignedTo: { $in: teamUserIds } });
    const completed = await TaskModel.countDocuments({ assignedTo: { $in: teamUserIds }, status: 'Completed' });
    const pending = await TaskModel.countDocuments({ assignedTo: { $in: teamUserIds }, status: 'Pending' });
    const overdue = await TaskModel.countDocuments({
      assignedTo: { $in: teamUserIds },
      dueDate: { $lt: now },
      status: { $ne: 'Completed' },
    });

    return { total, completed, pending, overdue };
  };
}
