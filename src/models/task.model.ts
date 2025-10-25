import { Schema, model, Document, Types } from 'mongoose';

export interface TaskDocument extends Document {
  title: string;
  description: string;
  dueDate: Date;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedTo: Types.ObjectId;
  createdBy: Types.ObjectId;
}

const TaskSchema = new Schema<TaskDocument>({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  dueDate: { type: Date },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const TaskModel = model<TaskDocument>('Task', TaskSchema);
