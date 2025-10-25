import { Router } from 'express';
import { UserController } from '@/controllers/users.controller';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { versionMiddleware } from '@/middlewares/version.middleware';
import { cacheMiddleware } from '@/middlewares/cache.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get own profile
    this.router.get('/getProfile', versionMiddleware(['1.0.0']), AuthMiddleware, authorizeRoles(['User', 'Manager', 'Admin']), (req, res) =>
      new UserController(req, res).getProfile(),
    );
    
    this.router.get(
      '/tasks',
      versionMiddleware(['1.0.0']),
      AuthMiddleware,
      authorizeRoles(['User', 'Manager', 'Admin']),
      cacheMiddleware('tasks', 30),
      (req, res) => new UserController(req, res).getTasks(),
    );

    // Create task
    this.router.post('/task', versionMiddleware(['1.0.0']), AuthMiddleware, authorizeRoles(['User', 'Manager', 'Admin']), (req, res) =>
      new UserController(req, res).createTask(),
    );

    // Update task
    this.router.put('/task/:id', versionMiddleware(['1.0.0']), AuthMiddleware, authorizeRoles(['User', 'Manager', 'Admin']), (req, res) =>
      new UserController(req, res).updateTask(),
    );

    // Delete task
    this.router.delete('/task/:id', versionMiddleware(['1.0.0']), AuthMiddleware, authorizeRoles(['User', 'Manager', 'Admin']), (req, res) =>
      new UserController(req, res).deleteTask(),
    );
  }
}
