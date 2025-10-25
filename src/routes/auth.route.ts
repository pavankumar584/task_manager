import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { LoginValidation } from '@/validation/auth/login.validation';
import { versionMiddleware } from '@/middlewares/version.middleware';
import { RegisterValidation } from '@/validation/auth/register.validation';

export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/login', versionMiddleware(['1.0.0']), ValidationMiddleware(LoginValidation, 'body'), (req, res) =>
      new AuthController(req, res).login(),
    );
    this.router.post('/register', versionMiddleware(['1.0.0']), ValidationMiddleware(RegisterValidation, 'body'), (req, res) =>
      new AuthController(req, res).register(),
    );
    this.router.post('/logout', versionMiddleware(['1.0.0']), AuthMiddleware, (req, res) => new AuthController(req, res).logout());
  };
  
}
