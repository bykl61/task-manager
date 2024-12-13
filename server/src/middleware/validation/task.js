import Joi from 'joi';

export const taskSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Başlık alanı boş bırakılamaz',
    'any.required': 'Başlık alanı zorunludur',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Açıklama alanı boş bırakılamaz',
    'any.required': 'Açıklama alanı zorunludur',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').required().messages({
    'any.only': 'Öncelik değeri low, medium veya high olmalıdır',
    'any.required': 'Öncelik alanı zorunludur',
  }),
  status: Joi.string().valid('pending', 'completed').optional().messages({
    'any.only': 'Durum değeri pending veya completed olmalıdır',
  }),
  dueDate: Joi.date().min('now').required().messages({
    'date.min': 'Bitiş tarihi şu andan daha ileri bir zaman olmalıdır',
    'any.required': 'Bitiş tarihi zorunludur',
  }),
  mediaType: Joi.string().valid('image', 'video', 'document').optional(),
  mediaUrl: Joi.string().when('mediaType', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

export const taskUpdateSchema = Joi.object({
  title: Joi.string().optional().messages({
    'string.empty': 'Başlık alanı boş bırakılamaz',
  }),
  description: Joi.string().optional().messages({
    'string.empty': 'Açıklama alanı boş bırakılamaz',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
    'any.only': 'Öncelik değeri low, medium veya high olmalıdır',
  }),
  status: Joi.string().valid('pending', 'completed').optional().messages({
    'any.only': 'Durum değeri pending veya completed olmalıdır',
  }),
  dueDate: Joi.date().greater('now').optional().messages({
    'date.greater': 'Bitiş tarihi bugünden sonra olmalıdır',
  }),
  mediaType: Joi.string().valid('image', 'video', 'document').optional(),
  mediaUrl: Joi.string().when('mediaType', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
}).min(1).messages({
  'object.min': 'En az bir alan güncellenmelidir'
});