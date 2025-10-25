import { AdminController } from '@/controllers/admin.controller';
import { Routes } from '@/interfaces/routes.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { versionMiddleware } from '@/middlewares/version.middleware';
import { adminValidation } from '@/validation/admin.validation';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { AdminAuthMiddleware } from '@/middlewares/admin.middleware';
import { Router } from 'express';

export class AdminRoutes implements Routes {
  public path = '/admin';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Admin login
    this.router.post(
      '/login',
      versionMiddleware(['1.0.0']),
      ValidationMiddleware(adminValidation, 'body'),
      (req, res) => new AdminController(req, res).adminLogin()
    );

    // Example: Get all users (Admin only)
    this.router.get(
      '/users',
      versionMiddleware(['1.0.0']),
      AdminAuthMiddleware,
      (req, res) => new AdminController(req, res).getAllUsers()
    );

    // Example: Assign task to any user (Admin only)
    this.router.post(
      '/assign-task',
      versionMiddleware(['1.0.0']),
      AdminAuthMiddleware,
      (req, res) => new AdminController(req, res).assignTask()
    );
  }
}
