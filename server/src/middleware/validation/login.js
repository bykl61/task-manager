import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir email giriniz.',
    'any.required': 'Email zorunludur.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Şifre en az 6 karakter olmalıdır.',
    'any.required': 'Şifre zorunludur.',
  }),
});
