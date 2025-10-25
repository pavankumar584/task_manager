import Joi from 'joi';

export interface UpdateUser {
  username: string;
  email: string;
  password: string;
  roles: 'user' | 'manager';
  managerId?: string;
}

export const UpdateUserValidation = Joi.object({
  username: Joi.string().min(3).max(30).optional().messages({
    'string.min': 'Username must be at least 3 characters long',
  }),

  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be valid',
  }),

  password: Joi.string().min(6).max(50).optional().messages({
    'string.min': 'Password must be at least 6 characters long',
  }),

  roles: Joi.string().valid('User', 'Manager', 'Admin').optional().messages({
    'any.only': 'Role must be one of User, Manager, or Admin',
  }),

  managerId: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Manager ID must be a string',
  }),
});
