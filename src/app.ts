import rateLimit from 'express-rate-limit';
import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@database';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    await dbConnection();
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // Global rate limiter
    const globalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests from this IP' },
    });
    this.app.use(globalLimiter);

    // Login-specific rate limiter
    const loginLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many login attempts' },
    });
    this.app.use('/auth/login', loginLimiter);
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => this.app.use(route.path, route.router));
    this.app.use((_, res) =>
      res.status(404).send({
        message: 'Not found, Check the URL you are requesting and try again',
      }),
    );
  }

  private initializeSwagger() {
    const swaggerDefinition = {
      openapi: '3.0.3',
      info: {
        title: 'Task Management API',
        version: '1.0.0',
        description: 'RESTful API for Task Management System',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local server' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          RegisterRequest: {
            type: 'object',
            required: ['username', 'email', 'password'],
            properties: {
              username: { type: 'string', example: 'JohnDoe' },
              email: { type: 'string', example: 'johndoe@example.com' },
              password: { type: 'string', example: 'StrongP@ssword123' },
              roles: { type: 'array', items: { type: 'string' }, example: ['User'] },
            },
          },
          LoginRequest: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', example: 'johndoe@example.com' },
              password: { type: 'string', example: 'StrongP@ssword123' },
            },
          },
          AuthResponse: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              token: { type: 'string' },
            },
          },
          UserProfile: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              username: { type: 'string' },
              email: { type: 'string' },
              roles: { type: 'array', items: { type: 'string' } },
              managerId: { type: 'string', nullable: true },
            },
          },
          Task: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              dueDate: { type: 'string', format: 'date' },
              priority: { type: 'string' },
              status: { type: 'string' },
              assignedTo: { $ref: '#/components/schemas/UserProfile' },
              createdBy: { $ref: '#/components/schemas/UserProfile' },
            },
          },
          TaskRequest: {
            type: 'object',
            required: ['title'],
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              dueDate: { type: 'string', format: 'date' },
              priority: { type: 'string' },
              assignedTo: { type: 'string' },
            },
          },
          AssignTaskRequest: {
            type: 'object',
            required: ['taskId', 'userId'],
            properties: {
              taskId: { type: 'string' },
              userId: { type: 'string' },
            },
          },
          AnalyticsResponse: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              completed: { type: 'integer' },
              pending: { type: 'integer' },
              overdue: { type: 'integer' },
            },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    };

    const options = { swaggerDefinition, apis: [] }; // APIs can be auto-generated from routes if needed
    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
