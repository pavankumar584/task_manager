import { model, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { generateToken } from '@/utils/token';
import { User } from '@/interfaces/users.interface';

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, set: (password: string) => bcrypt.hashSync(password, 10) },
  token: {
    virtual: true,
    type: String,
    get: function () {
      return generateToken(this._id.toString());
    },
  },
  roles: { type: String, enum: ['User', 'Manager', 'Admin'], required: true },
  managerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
});

export const UserModel = model<User & Document>('User', UserSchema);
