import { AnalyticsController } from '@/controllers/analytics.controller';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { Router } from 'express';

export class AnalyticsRoutes implements Routes {
  path = '/analytics';
  router = Router();
  constructor() {
    this.analytics();
  }
  private analytics() {
    this.router.get('/analytics/user', AuthMiddleware, authorizeRoles(['User', 'Manager', 'Admin']), (req, res) =>
      new AnalyticsController(req, res).getUserStats(),
    );

    this.router.get('/analytics/team', AuthMiddleware, authorizeRoles(['Manager', 'Admin']), (req, res) =>
      new AnalyticsController(req, res).getTeamStats(),
    );
  }
}
