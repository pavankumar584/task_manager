import Joi from 'joi';

export interface CreateUserValidationInterface {
  username: string;
  email: string;
  password: string;
  roles: 'user' | 'manager';
  managerId?: string;
}

export const CreateUserValidation = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'string.empty': 'Email is required',
  }),

  password: Joi.string().min(6).max(50).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required',
  }),

  roles: Joi.string().valid('User', 'Manager', 'Admin').required().messages({
    'any.only': 'Role must be one of User, Manager, or Admin',
  }),

  managerId: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Manager ID must be a string',
  }),
});
