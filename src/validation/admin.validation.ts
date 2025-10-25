import Joi from 'joi';

export interface AdminValidationInterface {
  email: string;
  password: string;
}

export const adminValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});