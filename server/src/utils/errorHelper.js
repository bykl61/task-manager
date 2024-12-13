export const ErrorHelper = {
  createError(type, message, details = null) {
    return { type, message, details };
  },
  validationError(error) {
    const details = error.details.map((detail) => detail.message);
    return this.createError('validation', 'Doğrulama hatası', details);
  },
  authError(message) {
    return this.createError('auth', message);
  },
  notFoundError(message) {
    return this.createError('notFound', message);
  },
  conflictError(message) {
    return this.createError('conflict', message);
  },
};
