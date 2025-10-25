import { RequestWithUser } from '@/interfaces/auth.interface';
import { AnalyticsService } from '@/services/analytics.service';
import { Request, Response } from 'express';

export class AnalyticsController extends AnalyticsService {
  constructor(req: Request, res: Response) {
    super(req as RequestWithUser, res);
  }
  public getUserStats = async () => {
    try {
      const result = await this.getUserStatsService();
      this.send(result);
    } catch (error) {
      this.error(error);
    }
  };
  public getTeamStats = async () => {
    try {
      const result = await this.getTeamStatsService();
      this.send(result);
    } catch (error) {
      this.error(error);
    }
  };
}
