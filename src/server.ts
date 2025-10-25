import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { AdminRoutes } from './routes/admin.route';
import { Server } from 'socket.io';
import http from 'http';

ValidateEnv();


const app = new App([new UserRoute(), new AuthRoute(), new AdminRoutes()]);


const server = http.createServer(app.app); 


export const io = new Server(server, {
  cors: { origin: '*' },
});


app.listen();
