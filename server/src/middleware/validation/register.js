import Joi from 'joi';

export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'İsim en az 2 karakter olmalıdır',
    'string.max': 'İsim en fazla 50 karakter olmalıdır',
    'any.required': 'İsim zorunludur',
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Soyisim en az 2 karakter olmalıdır',
    'string.max': 'Soyisim en fazla 50 karakter olmalıdır',
    'any.required': 'Soyisim zorunludur',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir email giriniz',
    'any.required': 'Email zorunludur',
  }),
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .required()
    .messages({
      'string.min': 'Şifre en az 6 karakter olmalıdır',
      'string.max': 'Şifre en fazla 30 karakter olmalıdır',
      'string.pattern.base': 'Şifre sadece harf ve rakam içermelidir',
      'any.required': 'Şifre zorunludur',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Şifreler eşleşmiyor',
    'any.required': 'Şifre tekrarı zorunludur',
  }),
});
