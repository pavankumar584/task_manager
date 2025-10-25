import Joi from "joi";

export const LoginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid format',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

