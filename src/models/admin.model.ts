import { Document, model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { generateToken } from '@/utils/token';

export interface Iadmin extends Document {
  name: string;
  email: string;
  password: string;
  token?: string;
}

const adminSchema = new Schema<Iadmin>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.virtual('token').get(function () {
  const _id = this._id.toString();
  const token = generateToken(_id);
  return token;
});

export const AdminModel = model<Iadmin>('admin', adminSchema);