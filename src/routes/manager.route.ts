import { Router } from 'express';
import { ManagerController } from '@controllers/manager.controller';
import { Routes } from '@interfaces/routes.interface';
import { versionMiddleware } from '@/middlewares/version.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';

export class ManagerRoute implements Routes {
  public path = '/manager';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/getprofile', versionMiddleware(['1.0.0']), AuthMiddleware, authorizeRoles(['Admin', 'Manager']), (req, res) =>
      new ManagerController(req, res).getProfile(),
    );

    this.router.get('/team', versionMiddleware(['1.0.0']), AuthMiddleware, authorizeRoles(['Manager']), (req, res) =>
      new ManagerController(req, res).getTeamMembers(),
    );

    this.router.get('/team/:id', versionMiddleware(['1.0.0']), AuthMiddleware, authorizeRoles(['Manager']), (req, res) =>
      new ManagerController(req, res).getUserUnderTeam(),
    );

    this.router.post('/assign', versionMiddleware(['1.0.0']), AuthMiddleware, authorizeRoles(['Manager']), (req, res) =>
      new ManagerController(req, res).assignTask(),
    );
  }
}
