import Joi from 'joi';

export interface RegisterValidationInterface {
  username: string;
  email: string;
  password: string;
  roles: 'User' | 'Manager' | 'Admin';
}

export const RegisterValidation = Joi.object<RegisterValidationInterface>({
  username: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username cannot exceed 50 characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.pattern.base':
      'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character',
    'any.required': 'Password is required',
  }),
  roles: Joi.string().valid('User', 'Manager', 'Admin').messages({
    'string.base': 'Role must be a string',
    'any.only': 'Role can only be User, Manager, or Admin',
  }),
});
