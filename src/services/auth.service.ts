import { RequestWithUser } from '@/interfaces/auth.interface';
import { Request, Response } from 'express';
import { MainService } from './main.service';
import { UserModel } from '@/models/users.model';
import { reject } from '@/utils/error';
import bcrypt from 'bcrypt';

export class AuthService extends MainService {
  constructor(req: Request, res: Response) {
    super(req as RequestWithUser, res);
  }
  public loginService = async () => {
    const { email, password } = this.req.body;
    const user = await UserModel.findOne({ email }, { password: 1, token: 1 });
    if (!user) reject('This account is not registered, please register first');
    if (!user.password) reject('This account is not registered with password, please login with google');
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) reject('Invalid password');
    return {
      message: 'Login Successfully..!',
      token: user.token,
    };
  };

  public registerService = async () => {
    const { username, email, password, roles } = this.req.body;
    const user = await UserModel.findOne({ email });
    if (user) reject('User already exists with this email, please login');
     await UserModel.create({
      username,
      email,
      password,
      roles,
    });
    return {
      message: 'Register Successfully...!',
    };
  };
  public logoutService = async () => {
    return {
      message: 'Logout successfully...!',
    };
  };
}
