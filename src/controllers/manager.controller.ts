import { Request, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { ManagerService } from '@/services/manager.service';

export class ManagerController extends ManagerService {
  constructor(req: Request, res: Response) {
    super(req as RequestWithUser, res);
  }
  public getProfile = async()=>{
    try {
      const profile = await this.getProfileService();
      this.send(profile);
    } catch (error) {
      this.error(error);
    }
  }
  public getTeamMembers = async () => {
    try {
      const team = await this.getTeamMembersService();
      this.send(team);
    } catch (error) {
      this.error(error);
    }
  };

  public getUserUnderTeam = async () => {
    try {
      const user = await this.getUserUnderTeamService();
      this.send(user);
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
