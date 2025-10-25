import Joi from 'joi';

export interface UpdateTaskValidationInterface {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: 'Low' | 'Medium' | 'High';
  status?: 'Pending' | 'In Progress' | 'Completed';
  assignedTo?: string; // ObjectId string
}

export const UpdateTaskValidation = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(5).max(500).optional(),
  dueDate: Joi.date().optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed').optional(),
  assignedTo: Joi.string().hex().length(24).optional(), // ObjectId validation
});
