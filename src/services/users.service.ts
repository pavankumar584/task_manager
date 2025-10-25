import { RequestWithUser } from '@/interfaces/auth.interface';
import { UserModel } from '@/models/users.model';
import { TaskModel } from '@/models/task.model';
import { MainService } from './main.service';
import { reject } from '@/utils/error';
import { Request, Response } from 'express';
import { io } from '@/server'; // Socket.io instance

export class UserService extends MainService {
  constructor(req: Request, res: Response) {
    super(req as RequestWithUser, res);
  }

  // -------------------- USER PROFILE --------------------
  public getProfileService = async () => {
    const user = await UserModel.findById(this.req.user._id).select('username email roles managerId');
    if (!user) return reject('User not found');
    return user;
  };

  // -------------------- GET TASKS WITH FILTER & SEARCH --------------------
  public getTasksService = async () => {
    const role = this.req.user.roles.toLowerCase();
    const { status, priority, dueDate, assignedTo, search } = this.req.query;

    let query: any = {};

    if (role === 'user') query.assignedTo = this.req.user._id;
    else if (role === 'manager') {
      const teamUserIds = await UserModel.find({ managerId: this.req.user._id }).distinct('_id');
      query.$or = [{ createdBy: this.req.user._id }, { assignedTo: { $in: teamUserIds } }];
    }
    // Admin sees all tasks
    else if (role === 'admin') query = {};

    // Filtering
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate as string) };
    if (assignedTo) query.assignedTo = assignedTo;

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await TaskModel.find(query)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .lean();

    return tasks;
  };

  // -------------------- CREATE TASK --------------------
  public createTaskService = async () => {
    const { title, description, dueDate, priority, assignedTo } = this.req.body;

    const existing = await TaskModel.findOne({ title });
    if (existing) return reject('Task title already exists');

    const role = this.req.user.roles.toLowerCase();
    let finalAssignedTo = assignedTo;

    if (role === 'user') finalAssignedTo = this.req.user._id;
    else if (role === 'manager') {
      const teamUserIds = await UserModel.find({ managerId: this.req.user._id }).distinct('_id');
      if (!teamUserIds.includes(assignedTo)) return reject('Cannot assign task outside your team');
    }

    const newTask = await TaskModel.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo: finalAssignedTo,
      createdBy: this.req.user._id,
    });

    // Emit Socket.io event
    io.to(finalAssignedTo.toString()).emit('task_created', newTask);

    return { message: 'Task created successfully!', task: newTask };
  };

  // -------------------- UPDATE TASK --------------------
  public updateTaskService = async () => {
    const { id } = this.req.params;
    const updates = this.req.body;

    const task = await TaskModel.findById(id);
    if (!task) return reject('Task not found');

    const role = this.req.user.roles.toLowerCase();

    // User can only update own task
    if (role === 'user' && task.assignedTo.toString() !== this.req.user._id.toString()) return reject('Access denied');

    // Manager can update own + team tasks
    if (role === 'manager') {
      const teamUserIds = await UserModel.find({ managerId: this.req.user._id }).distinct('_id');
      if (task.createdBy.toString() !== this.req.user._id.toString() && !teamUserIds.includes(task.assignedTo.toString())) {
        return reject('Access denied');
      }
    }

    await TaskModel.updateOne({ _id: id }, { $set: updates });
    const updatedTask = await TaskModel.findById(id);

    // Emit Socket.io event
    io.to(task.assignedTo.toString()).emit('task_updated', updatedTask);

    return { message: 'Task updated successfully!', task: updatedTask };
  };

  // -------------------- DELETE TASK --------------------
  public deleteTaskService = async () => {
    const { id } = this.req.params;

    const task = await TaskModel.findById(id);
    if (!task) return reject('Task not found');

    const role = this.req.user.roles.toLowerCase();

    if (role === 'user' && task.assignedTo.toString() !== this.req.user._id.toString()) return reject('Access denied');

    if (role === 'manager') {
      const teamUserIds = await UserModel.find({ managerId: this.req.user._id }).distinct('_id');
      if (task.createdBy.toString() !== this.req.user._id.toString() && !teamUserIds.includes(task.assignedTo.toString())) {
        return reject('Access denied');
      }
    }

    await TaskModel.deleteOne({ _id: id });

    // Emit Socket.io event
    io.to(task.assignedTo.toString()).emit('task_deleted', task);

    return { message: 'Task deleted successfully!', task };
  };

  // -------------------- ANALYTICS --------------------
  public getTaskStats = async () => {
    const role = this.req.user.roles.toLowerCase();
    let query: any = {};

    if (role === 'user') query.assignedTo = this.req.user._id;
    else if (role === 'manager') {
      const teamUserIds = await UserModel.find({ managerId: this.req.user._id }).distinct('_id');
      query.$or = [{ createdBy: this.req.user._id }, { assignedTo: { $in: teamUserIds } }];
    }

    const total = await TaskModel.countDocuments(query);
    const completed = await TaskModel.countDocuments({ ...query, status: 'Completed' });
    const pending = await TaskModel.countDocuments({ ...query, status: 'Pending' });
    const overdue = await TaskModel.countDocuments({ ...query, dueDate: { $lt: new Date() }, status: { $ne: 'Completed' } });

    return { total, completed, pending, overdue };
  };
}
