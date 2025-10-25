import Joi from 'joi';

export interface CreateTaskValidationInterface {
  title: string;
  description: string;
  dueDate?: Date;
  priority?: 'Low' | 'Medium' | 'High';
  assignedTo?: string;
  createdBy?: string;
}

export const CreateTaskValidation = Joi.object<CreateTaskValidationInterface>({
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().min(3).max(1000).required(),
  dueDate: Joi.date().optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').optional().default('Medium'),
  assignedTo: Joi.string().optional(), // should be a valid MongoDB ObjectId if you want stricter validation
  createdBy: Joi.string().optional(), // usually set from req.user._id in backend
});
